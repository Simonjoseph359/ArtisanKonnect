import React from "react";
import Link from "next/link";
import { FaSearch, FaCalendarCheck, FaHistory } from "react-icons/fa";

export default function ClientDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back! 👋</h1>
          <p className="text-xs text-gray-500 mt-1">Book trusted artisans for your home repairs.</p>
        </div>
        <Link href="/client/findartisan" className="px-5 py-3 bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2">
          <FaSearch /> Search Artisans
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
          <FaCalendarCheck className="text-emerald-600 text-2xl" />
          <div><p className="text-xs text-gray-500 font-semibold">Active Bookings</p><p className="text-2xl font-extrabold text-gray-900">1</p></div>
        </div>
        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
          <FaHistory className="text-blue-600 text-2xl" />
          <div><p className="text-xs text-gray-500 font-semibold">Completed Services</p><p className="text-2xl font-extrabold text-gray-900">5</p></div>
        </div>
      </div>
    </div>
  );
}