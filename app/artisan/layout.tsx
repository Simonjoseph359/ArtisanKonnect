import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { FaTasks, FaUser, FaBriefcase, FaSignOutAlt } from "react-icons/fa";

export default async function ArtisanLayout({ children }: { children: React.ReactNode }) {
  // 1. Verify user session on the server
  const session = await auth();

  // 2. Redirect unauthenticated users
  if (!session) {
    redirect("/auth");
  }

  // 3. Render your existing UI layout
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/artisan/dashboard" className="text-xl font-black text-emerald-600">
            Artisan<span className="text-gray-900">Portal</span>
          </Link>
          <nav className="flex items-center gap-6 text-xs font-bold text-gray-600">
            <Link href="/artisan/dashboard" className="flex items-center gap-2 hover:text-emerald-600">
              <FaTasks /> Dashboard
            </Link>
            <Link href="/artisan/jobs" className="flex items-center gap-2 hover:text-emerald-600">
              <FaBriefcase /> Job Requests
            </Link>
            <Link href="/artisan/profile" className="flex items-center gap-2 hover:text-emerald-600">
              <FaUser /> Profile
            </Link>
          </nav>
          <Link href="/" className="text-xs text-red-500 font-semibold flex items-center gap-1">
            <FaSignOutAlt /> Sign Out
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
    </div>
  );
}