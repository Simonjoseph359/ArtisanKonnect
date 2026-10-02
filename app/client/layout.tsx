"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaSearch, FaCalendarCheck } from "react-icons/fa";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [initial, setInitial] = useState("C");

  useEffect(() => {
    // 1. Listen for active Firebase Auth user state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not logged in -> redirect to login screen
        router.push("/auth");
        return;
      }

      try {
        // 2. Fetch user's role from Firestore 'users' collection
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.accountType === "client") {
            // Authorized client -> render layout
            const fullName = userData.fullName || user.displayName || "";
            setInitial(fullName ? fullName[0].toUpperCase() : "C");
            setIsAuthorized(true);
          } else if (userData.accountType === "artisan") {
            // Signed in as artisan -> send to artisan area
            router.push("/artisan/jobs");
          } else {
            router.push("/auth");
          }
        } else {
          // No Firestore record found for this UID
          router.push("/auth");
        }
      } catch (error) {
        console.error("Error verifying client role:", error);
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Prevent UI flashing before security check finishes
  if (!isAuthorized) {
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