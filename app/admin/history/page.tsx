"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { FaHistory, FaDownload } from "react-icons/fa";

export default function AdminHistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const q = query(collection(db, "jobRequests"));
        const snap = await getDocs(q);
        const list = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Filter out active/pending jobs so only historical/completed ones show up, or sort them
        const completedList = list.filter(
          (item: any) => item.status === "completed" || item.status === "disbursed"
        );

        setTransactions(completedList);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaHistory className="text-emerald-400" /> Platform Transaction Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of all completed works, gross amounts, artisan payouts, and platform revenues.
          </p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Job Details</th>
                <th className="p-4">Client & Artisan</th>
                <th className="p-4">Date</th>
                <th className="p-4">Gross Amount</th>
                <th className="p-4">Artisan Payout</th>
                <th className="p-4">Platform Cut</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No completed transaction history recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const grossAmount = Number(tx.proposedBudget || tx.amount || tx.price || 0);
                  const platformFee = tx.platformFee ? Number(tx.platformFee) : grossAmount * 0.1;
                  const artisanPayout = grossAmount - platformFee;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-750 transition">
                      <td className="p-4">
                        <p className="font-bold text-white text-sm">
                          {tx.jobTitle || tx.title || "Artisan Service"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {tx.id.slice(0, 8)}...</p>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="text-white font-medium">Client: <span className="text-slate-300">{tx.clientName || tx.clientId}</span></p>
                        <p className="text-slate-400">Artisan ID: {tx.artisanId}</p>
                      </td>
                      <td className="p-4 text-slate-400">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4 font-extrabold text-white">
                        ₦{grossAmount.toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        ₦{artisanPayout.toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-purple-400">
                        ₦{platformFee.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md font-semibold text-[10px] uppercase tracking-wide border ${
                            tx.status === "disbursed"
                              ? "bg-purple-950 text-purple-300 border-purple-800"
                              : "bg-emerald-950 text-emerald-400 border-emerald-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}