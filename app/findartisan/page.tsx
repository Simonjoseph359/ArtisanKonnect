"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

const CATEGORIES = [
  "All",
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Painting",
  "AC Repairs",
  "Welding",
];

export default function FindArtisanPage() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [filteredArtisans, setFilteredArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchArtisans() {
      try {
        const querySnapshot = await getDocs(collection(db, "artisans"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtisans(data);
        setFilteredArtisans(data);
      } catch (error) {
        console.error("Error fetching artisans:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArtisans();
  }, []);

  useEffect(() => {
    let result = artisans;

    // Filter by trade category
    if (selectedCategory !== "All") {
      result = result.filter(
        (artisan) =>
          artisan.trade?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search input (name, trade, bio, or skills)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((artisan) => {
        const nameMatch = artisan.name?.toLowerCase().includes(term);
        const tradeMatch = artisan.trade?.toLowerCase().includes(term);
        const bioMatch = artisan.bio?.toLowerCase().includes(term);
        const skillsMatch =
          Array.isArray(artisan.skills) &&
          artisan.skills.some((s: string) => s.toLowerCase().includes(term));
        return nameMatch || tradeMatch || bioMatch || skillsMatch;
      });
    }

    setFilteredArtisans(result);
  }, [searchTerm, selectedCategory, artisans]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading live artisans...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header and Search Input */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Find Skilled Artisans
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Discover and hire vetted professionals near you.
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, trade, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {filteredArtisans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto my-12">
            <p className="text-gray-500 font-medium text-sm">
              No artisans found matching your search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-xs font-bold text-emerald-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map((artisan) => (
              <div
                key={artisan.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <img
                    src={
                      artisan.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                    }
                    alt={artisan.name}
                    className="w-20 h-20 rounded-xl object-cover mb-4 border border-gray-100"
                  />
                  <span className="text-xs font-bold uppercase text-emerald-600">
                    {artisan.trade}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    {artisan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {artisan.bio}
                  </p>

                  {/* Skills */}
                  {Array.isArray(artisan.skills) && artisan.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {artisan.skills.slice(0, 3).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* PORTFOLIO / PAST WORK MINI PREVIEW */}
                  {Array.isArray(artisan.portfolio) && artisan.portfolio.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-50">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">
                        Past Work Samples
                      </p>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {artisan.portfolio.slice(0, 4).map((workImg: string, pIdx: number) => (
                          <img
                            key={pIdx}
                            src={workImg}
                            alt={`Work ${pIdx + 1}`}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-extrabold text-gray-900 text-sm">
                    {artisan.rate}
                  </span>
                  <Link
                    href={`/findartisan/${artisan.id}`}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}