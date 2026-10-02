"use client";

import React from "react";
import Link from "next/link";
import { FaWallet, FaTasks, FaStar, FaUserCheck } from "react-icons/fa";

export default function ArtisanDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back! 🛠️</h1>
          <p className="text-xs text-gray-500 mt-1">Track incoming job offers and manage earnings.</p>
        </div>
        <Link href="/artisan/jobs" className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl">View Jobs</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
          <FaTasks className="text-amber-500 text-2xl" />
          <div><p className="text-xs text-gray-500 font-semibold">Requests</p><p className="text-xl font-extrabold">3 Pending</p></div>
        </div>
        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
          <FaWallet className="text-emerald-500 text-2xl" />
          <div><p className="text-xs text-gray-500 font-semibold">Total Revenue</p><p className="text-xl font-extrabold">₦185,000</p></div>
        </div>
        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
          <FaStar className="text-yellow-400 text-2xl" />
          <div><p className="text-xs text-gray-500 font-semibold">Rating</p><p className="text-xl font-extrabold">4.9 ★</p></div>
        </div>
        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
          <FaUserCheck className="text-blue-500 text-2xl" />
          <div><p className="text-xs text-gray-500 font-semibold">Jobs Completed</p><p className="text-xl font-extrabold">28</p></div>
        </div>
      </div>
    </div>
  );
}