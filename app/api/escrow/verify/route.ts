import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!reference) {
    return NextResponse.redirect(`${baseUrl}/client/dashboard?payment=error`);
  }

  try {
    // 1. Verify transaction with Paystack API
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackRes.json();

    // 2. Check if transaction was successful
    if (paystackData.status && paystackData.data.status === "success") {
      const jobId = paystackData.data.metadata?.jobId;

      if (jobId) {
        // 3. Update Firestore job status from PENDING_PAYMENT to ESCROW_FUNDED
        const jobRef = doc(db, "jobs", jobId);
        await updateDoc(jobRef, {
          status: "ESCROW_FUNDED",
          paystackReference: reference,
          fundedAt: new Date().toISOString(),
        });
      }

      // Redirect client dashboard with success notification
      return NextResponse.redirect(`${baseUrl}/client/dashboard?payment=success`);
    } else {
      return NextResponse.redirect(`${baseUrl}/client/dashboard?payment=failed`);
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(`${baseUrl}/client/dashboard?payment=error`);
  }
}