"use client";

import React, { useState } from "react";

interface JobProps {
  job: {
    id: string;
    jobTitle: string;
    totalAmount: number;
    platformFee: number;
    artisanPayout: number;
    status: "PENDING_PAYMENT" | "ESCROW_FUNDED" | "WORK_COMPLETED" | "CLIENT_APPROVED" | "FUNDS_DISBURSED";
    artisanEmail: string;
    clientId: string;
  };
  currentUserEmail: string;
  onRefresh?: () => void;
}

export default function EscrowJobCard({ job, currentUserEmail, onRefresh }: JobProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "COMPLETE" | "APPROVE" | "DISBURSE") => {
    setLoading(true);
    try {
      const res = await fetch("/api/escrow/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, action }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Status updated successfully to ${data.status}!`);
        if (onRefresh) onRefresh();
      } else {
        alert(data.error || "Action failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating job status.");
    } finally {
      setLoading(false);
    }
  };

  const isArtisan = job.artisanEmail?.toLowerCase().trim() === currentUserEmail.toLowerCase().trim();
  const isClient = job.clientId?.toLowerCase().trim() === currentUserEmail.toLowerCase().trim();

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-base">{job.jobTitle}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Job ID: {job.id}</p>
        </div>

        {/* STATUS BADGES */}
        {job.status === "ESCROW_FUNDED" && (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">
            🛡️ Escrow Funded
          </span>
        )}
        {job.status === "WORK_COMPLETED" && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
            ⚙️ Work Completed
          </span>
        )}
        {job.status === "CLIENT_APPROVED" && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            ✓ Client Approved
          </span>
        )}
        {job.status === "FUNDS_DISBURSED" && (
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
            💰 Payout Complete
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl text-xs">
        <div>
          <span className="text-gray-500 block">Total Amount Paid</span>
          <span className="font-extrabold text-gray-900">₦{job.totalAmount.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Artisan Payout (90%)</span>
          <span className="font-extrabold text-emerald-600">₦{job.artisanPayout.toLocaleString()}</span>
        </div>
      </div>

      {/* ACTION BUTTONS BASED ON STATE & USER ROLE */}
      <div className="pt-2">
        {/* ARTISAN BUTTON */}
        {isArtisan && job.status === "ESCROW_FUNDED" && (
          <button
            onClick={() => handleAction("COMPLETE")}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Updating..." : "Mark Job as Done"}
          </button>
        )}

        {/* CLIENT BUTTON */}
        {isClient && job.status === "WORK_COMPLETED" && (
          <button
            onClick={() => handleAction("APPROVE")}
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Updating..." : "Approve Work & Release Funds"}
          </button>
        )}

        {/* WAITING STATES */}
        {isArtisan && job.status === "WORK_COMPLETED" && (
          <p className="text-xs text-center text-gray-500 italic">
            Waiting for client inspection and approval...
          </p>
        )}
        {isArtisan && job.status === "CLIENT_APPROVED" && (
          <p className="text-xs text-center text-emerald-600 font-medium">
            Client approved! Admin is processing your payout transfer.
          </p>
        )}
      </div>
    </div>
  );
}