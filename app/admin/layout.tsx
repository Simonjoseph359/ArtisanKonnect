import React from "react";
import Link from "next/link";
import { FaChartBar, FaUsers, FaCog, FaUserShield } from "react-icons/fa";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Admin Sidebar Layout Shell */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xl">
            <FaUserShield /> Admin Panel
          </div>
          <nav className="space-y-2 text-sm font-semibold text-slate-400">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
              <FaChartBar /> Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
              <FaUsers /> User Control
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
              <FaCog /> Settings
            </Link>
          </nav>
        </div>
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">← Back to Public Site</Link>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/50 backdrop-blur">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">System Management Portal</h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">System Live</span>
        </header>
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}