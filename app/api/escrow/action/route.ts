import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, action } = await req.json(); // action: "COMPLETE", "APPROVE", or "DISBURSE"
    if (!jobId || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const jobData = jobSnap.data();
    const userEmail = session.user.email.toLowerCase().trim();

    // 1. ARTISAN MARKS JOB DONE
    if (action === "COMPLETE") {
      if (jobData.artisanEmail?.toLowerCase().trim() !== userEmail) {
        return NextResponse.json({ error: "Only the assigned artisan can perform this action" }, { status: 403 });
      }
      if (jobData.status !== "ESCROW_FUNDED") {
        return NextResponse.json({ error: "Job must be in ESCROW_FUNDED state" }, { status: 400 });
      }

      await updateDoc(jobRef, {
        status: "WORK_COMPLETED",
        completedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, status: "WORK_COMPLETED" });
    }

    // 2. CLIENT APPROVES WORK
    if (action === "APPROVE") {
      if (jobData.clientId?.toLowerCase().trim() !== userEmail) {
        return NextResponse.json({ error: "Only the paying client can approve this work" }, { status: 403 });
      }
      if (jobData.status !== "WORK_COMPLETED") {
        return NextResponse.json({ error: "Job must be marked completed by artisan first" }, { status: 400 });
      }

      await updateDoc(jobRef, {
        status: "CLIENT_APPROVED",
        approvedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, status: "CLIENT_APPROVED" });
    }

    // 3. ADMIN CONFIRMS MANUAL PAYOUT
    if (action === "DISBURSE") {
      // Ensure current user is an admin
      const isAdmin = userEmail === "admin@artisankonnect.com"; // Replace with your admin email or role check
      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
      }

      if (jobData.status !== "CLIENT_APPROVED") {
        return NextResponse.json({ error: "Job must be CLIENT_APPROVED before disbursing funds" }, { status: 400 });
      }

      // Mark as disbursed and increment artisan stats
      await updateDoc(jobRef, {
        status: "FUNDS_DISBURSED",
        disbursedAt: new Date().toISOString(),
      });

      // Update artisan completed jobs count in firestore
      if (jobData.artisanId) {
        const artisanRef = doc(db, "artisans", jobData.artisanId);
        await updateDoc(artisanRef, {
          completedJobs: increment(1),
        });
      }

      return NextResponse.json({ success: true, status: "FUNDS_DISBURSED" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Escrow action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}