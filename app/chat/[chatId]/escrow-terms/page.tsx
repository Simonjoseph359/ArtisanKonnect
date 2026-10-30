"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function EscrowTermsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const artisanId = searchParams.get("artisanId");
  const artisanEmail = searchParams.get("artisanEmail");
  const artisanName = searchParams.get("artisanName") || "Artisan";
  
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("15000"); // Default test amount or dynamic input
  const [jobTitle, setJobTitle] = useState("Service Engagement");

  const handleInitializePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please accept the escrow terms and conditions to proceed.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/escrow/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanId,
          artisanEmail,
          jobTitle,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (data.authorizationUrl) {
        // Redirect client directly to Paystack payment gateway
        window.location.href = data.authorizationUrl;
      } else {
        alert(data.error || "Failed to initialize Paystack payment.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">ArtisanKonnect Escrow Protection</h1>
          <p className="text-xs text-gray-500 mt-1">Review our safety rules before funding your job with {artisanName}.</p>
        </div>

        {/* RULES AND GUIDELINES */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-xs text-gray-700 leading-relaxed">
          <h3 className="font-bold text-gray-900">How Escrow Works:</h3>
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Your funds are safely held in escrow and <strong>not</strong> sent directly to the artisan.</li>
            <li>The artisan will complete the agreed task, and you can inspect the quality of work.</li>
            <li>Once you approve the completed job on your dashboard, admin releases the payout.</li>
            <li>10% platform fee applies to support secure dispute resolution and operations.</li>
          </ul>
        </div>

        {/* JOB DETAILS INPUTS */}
        <form onSubmit={handleInitializePayment} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Job Description / Title</label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Agreed Amount (₦)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-emerald-600"
            />
          </div>

          {/* TERMS CHECKBOX */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-gray-600 cursor-pointer">
              I understand and agree to ArtisanKonnect's escrow safety guidelines and refund policies.
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-1/3 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              Back to Chat
            </button>
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition disabled:opacity-50 cursor-pointer shadow"
            >
              {loading ? "Connecting to Paystack..." : `Proceed to Pay ₦${Number(amount || 0).toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}