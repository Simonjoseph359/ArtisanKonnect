"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaSearch, FaCalendarCheck, FaHistory } from "react-icons/fa";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import EscrowJobCard from "@/components/EscrowJobCard"; // Adjust import path if needed

export default function ClientDashboardPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientJobs = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }
    
    try {
      // Query jobs where clientId matches the logged-in user's email
      const q = query(
        collection(db, "jobs"),
        where("clientId", "==", session.user.email.toLowerCase().trim())
      );
      const snap = await getDocs(q);
      const jobList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobList);
    } catch (err) {
      console.error("Error fetching client jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientJobs();
  }, [session]);

  const activeBookingsCount = jobs.filter(
    (j) => j.status === "ESCROW_FUNDED" || j.status === "WORK_COMPLETED"
  ).length;

  const completedServicesCount = jobs.filter(
    (j) => j.status === "CLIENT_APPROVED" || j.status === "FUNDS_DISBURSED"
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back! 👋</h1>
          <p className="text-xs text-gray-500 mt-1">Book trusted artisans for your home repairs.</p>
        </div>
        <Link
          href="/client/findartisan"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer shadow"
        >
          <FaSearch /> Search Artisans
        </Link>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm">
          <FaCalendarCheck className="text-emerald-600 text-2xl" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Active Bookings / Escrow</p>
            <p className="text-2xl font-extrabold text-gray-900">
              {loading ? "..." : activeBookingsCount}
            </p>
          </div>
        </div>
        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm">
          <FaHistory className="text-blue-600 text-2xl" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Completed Services</p>
            <p className="text-2xl font-extrabold text-gray-900">
              {loading ? "..." : completedServicesCount}
            </p>
          </div>
        </div>
      </div>

      {/* Live Escrow Jobs Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Your Active Escrow Agreements</h2>

        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-500">
            Loading your active jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-500">
            No escrow agreements found. Click "Make Payment" from your artisan chat window to fund a job!
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <EscrowJobCard
                key={job.id}
                job={job}
                currentUserEmail={session?.user?.email || ""}
                onRefresh={fetchClientJobs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}