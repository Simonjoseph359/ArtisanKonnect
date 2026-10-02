"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ArtisanProfilePage() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtisan() {
      if (!id) return;
      try {
        const docRef = doc(db, "artisans", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArtisan({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such artisan found in database!");
        }
      } catch (error) {
        console.error("Error fetching artisan profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArtisan();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl border border-gray-100 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Artisan Not Found
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            The profile you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/findartisan"
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      <main className="max-w-4xl mx-auto px-6 pt-8">
        {/* Back Link */}
        <Link
          href="/findartisan"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-600 mb-6 transition"
        >
          ← Back to All Artisans
        </Link>

        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={
                artisan.image ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
              }
              alt={artisan.name}
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border border-gray-100"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {artisan.trade}
                </span>

                <span className="text-xl font-extrabold text-gray-900">
                  {artisan.rate}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
                {artisan.name}
              </h1>
              <p className="text-sm font-medium text-gray-500">
                {artisan.title || `${artisan.trade} Professional`}
              </p>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>📍 {artisan.location || "Location on request"}</span>
                {artisan.rating && (
                  <span className="font-bold text-amber-500">
                    ★ {artisan.rating} ({artisan.reviewsCount || 0} reviews)
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => alert(`Contacting ${artisan.name}...`)}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition"
                >
                  Contact Artisan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                About
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {artisan.bio || "No biography provided."}
              </p>
            </div>

            {/* Skills */}
            {Array.isArray(artisan.skills) && artisan.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {artisan.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                Overview
              </h2>

              <ul className="space-y-3 text-xs">
                <li className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Verified Pro</span>
                  <span className="font-bold text-emerald-600">
                    {artisan.verified !== false ? "Yes ✓" : "Pending"}
                  </span>
                </li>
                <li className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Jobs Completed</span>
                  <span className="font-bold text-gray-900">
                    {artisan.completedJobs ?? 0}
                  </span>
                </li>
                <li className="flex justify-between py-1">
                  <span className="text-gray-500">Location</span>
                  <span className="font-bold text-gray-900">
                    {artisan.location || "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}