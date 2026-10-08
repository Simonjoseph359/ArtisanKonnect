"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaSearch, FaCalendarCheck } from "react-icons/fa";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [initial, setInitial] = useState("C");

  useEffect(() => {
    // 1. If NextAuth confirms user is not logged in, redirect to auth
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    // 2. If authenticated, check the accountType you passed through auth.ts
    if (status === "authenticated" && session?.user) {
      const accountType = (session.user as any).accountType;

      if (accountType === "artisan") {
        router.push("/artisan/dashboard");
      } else {
        // Authorized client -> set avatar initial
        const fullName = session.user.name || "Client";
        setInitial(fullName.charAt(0).toUpperCase());
      }
    }
  }, [status, session, router]);

  // Prevent UI flashing before security check finishes
  if (status === "loading" || status === "unauthenticated" || (session?.user as any)?.accountType !== "client") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-emerald-600 font-medium text-sm">
        Verifying client access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/client/dashboard" className="text-xl font-extrabold text-emerald-600">
            Client<span className="text-gray-900">Hub</span>
          </Link>
          <nav className="flex items-center gap-6 text-xs font-bold text-gray-600">
            <Link href="/client/dashboard" className="hover:text-emerald-600">
              Dashboard
            </Link>
            <Link href="/client/findartisan" className="flex items-center gap-1.5 hover:text-emerald-600">
              <FaSearch /> Find Artisans
            </Link>
            <Link href="/client/bookings" className="flex items-center gap-1.5 hover:text-emerald-600">
              <FaCalendarCheck /> Bookings
            </Link>
          </nav>
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
            {initial}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
    </div>
  );
}