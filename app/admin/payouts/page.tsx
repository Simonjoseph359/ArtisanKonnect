"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminPayoutsPage() {
  const [pendingPayouts, setPendingPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "jobs"), where("status", "==", "CLIENT_APPROVED"));
      const snap = await getDocs(q);
      const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingPayouts(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleDisburse = async (jobId: string) => {
    if (!confirm("Have you completed the bank transfer to the artisan?")) return;

    setProcessingId(jobId);
    try {
      const res = await fetch("/api/escrow/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action: "DISBURSE" }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Payout marked as disbursed!");
        fetchPayouts();
      } else {
        alert(data.error || "Failed to confirm payout.");
      }
    } catch (err) {
      console.error(err);
      alert("Error confirming payout.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Admin Payout Control Center</h1>
            <p className="text-xs text-gray-500 mt-1">
              Verify client-approved jobs and process manual payouts to artisans.
            </p>
          </div>
          <button
            onClick={fetchPayouts}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
          >
            Refresh List
          </button>
        </div>

        {pendingPayouts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
            <p className="text-sm text-gray-500">No pending payouts waiting for admin approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPayouts.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Client Approved
                  </span>
                  <h3 className="font-bold text-gray-900 text-base">{job.jobTitle}</h3>
                  <p className="text-xs text-gray-500">Artisan Email: {job.artisanEmail}</p>
                  <p className="text-xs text-gray-500">Client Email: {job.clientId}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Net Payout (90%)</span>
                    <span className="text-lg font-extrabold text-emerald-600">
                      ₦{job.artisanPayout?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      Platform Fee: ₦{job.platformFee?.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDisburse(job.id)}
                    disabled={processingId === job.id}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {processingId === job.id ? "Processing..." : "Confirm Payout Sent"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}