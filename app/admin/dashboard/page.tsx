import React from "react";
import { FaUsers, FaTools, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Platform Control Metrics</h1>
        <p className="text-xs text-slate-400 mt-1">Overview of all system activity across Abuja regions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center gap-4">
          <FaUsers className="text-2xl text-blue-400" />
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Users</p>
            <p className="text-2xl font-extrabold text-white">142</p>
          </div>
        </div>
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center gap-4">
          <FaTools className="text-2xl text-amber-400" />
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Artisans</p>
            <p className="text-2xl font-extrabold text-white">48</p>
          </div>
        </div>
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center gap-4">
          <FaCheckCircle className="text-2xl text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Bookings Completed</p>
            <p className="text-2xl font-extrabold text-white">310</p>
          </div>
        </div>
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center gap-4">
          <FaMoneyBillWave className="text-2xl text-purple-400" />
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Platform Revenue</p>
            <p className="text-2xl font-extrabold text-white">₦120,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}