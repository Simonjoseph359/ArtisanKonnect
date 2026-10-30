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

  // 3. Render your responsive UI layout
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/artisan/dashboard" className="text-lg sm:text-xl font-black text-emerald-600 truncate">
            Artisan<span className="text-gray-900">Portal</span>
          </Link>
          
          {/* Responsive Navigation Links */}
          <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-gray-600">
            <Link href="/artisan/dashboard" className="flex items-center gap-1.5 hover:text-emerald-600">
              <FaTasks className="text-sm" /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link href="/artisan/jobs" className="flex items-center gap-1.5 hover:text-emerald-600">
              <FaBriefcase className="text-sm" /> <span className="hidden sm:inline">Job Requests</span>
            </Link>
            <Link href="/artisan/profile" className="flex items-center gap-1.5 hover:text-emerald-600">
              <FaUser className="text-sm" /> <span className="hidden sm:inline">Profile</span>
            </Link>
          </nav>

          <Link href="/" className="text-xs text-red-500 font-semibold flex items-center gap-1 hover:opacity-80">
            <FaSignOutAlt /> <span className="hidden sm:inline">Sign Out</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}