import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { artisanId, artisanEmail, jobTitle, amount } = await req.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    const totalAmount = Number(amount);
    const commissionRate = 0.10; // 10% Platform fee
    const platformFee = totalAmount * commissionRate;
    const artisanPayout = totalAmount - platformFee;

    // 1. Create PENDING_PAYMENT document in Firestore
    const jobRef = await addDoc(collection(db, "jobs"), {
      clientId: session.user.email,
      artisanId,
      artisanEmail,
      jobTitle,
      totalAmount,
      commissionRate,
      platformFee,
      artisanPayout,
      status: "PENDING_PAYMENT",
      createdAt: new Date().toISOString(),
    });

    // 2. Call Paystack API
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: totalAmount * 100, // Paystack works in Kobo (₦1 = 100 Kobo)
        callback_url: `${process.env.NEXTAUTH_URL}/client/dashboard`,
        metadata: {
          jobId: jobRef.id,
          clientId: session.user.email,
          artisanId,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      return NextResponse.json({ error: "Paystack initialization failed" }, { status: 500 });
    }

    return NextResponse.json({
      authorizationUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      jobId: jobRef.id,
    });
  } catch (error) {
    console.error("Escrow initialization error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}