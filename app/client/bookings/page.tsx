import React from "react";

export default function ClientBookingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Booking History</h1>
      <div className="bg-white p-6 border border-gray-100 rounded-2xl space-y-4">
        <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl">
          <div>
            <h3 className="font-bold text-gray-900">Emeka Johnson</h3>
            <p className="text-xs text-gray-500">Plumbing Repair • Maitama, Abuja</p>
            <span className="inline-block mt-2 text-[10px] bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full font-bold">Pending Confirmation</span>
          </div>
          <p className="font-extrabold text-sm text-gray-900">₦12,000</p>
        </div>
      </div>
    </div>
  );
}