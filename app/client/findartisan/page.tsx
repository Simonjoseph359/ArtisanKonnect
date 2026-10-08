"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import JobRequestModal from "@/components/jobRequestModal";

const CATEGORIES = [
  "All",
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Painting",
  "AC Repairs",
  "Welding",
];

export default function ClientFindArtisanPage() {
  const { data: session } = useSession();
  const [artisans, setArtisans] = useState<any[]>([]);
  const [filteredArtisans, setFilteredArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    async function fetchArtisans() {
      try {
        // 1. Fetch from 'artisans' collection
        const artisansSnap = await getDocs(collection(db, "artisans"));
        const artisansData = artisansSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2. Fetch registered artisan users from 'users' collection
        const usersQ = query(collection(db, "users"), where("accountType", "==", "artisan"));
        const usersSnap = await getDocs(usersQ);
        const usersData = usersSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.fullName || data.name || "Artisan",
            trade: data.trade || data.skill || "General Repair",
            bio: data.bio || "Experienced local professional ready to help.",
            location: data.location || "Abuja",
            rate: data.rate || "Negotiable",
            skills: data.skills || [data.skill || "General"],
            image: data.image || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300",
            ...data,
          };
        });

        // Combine both sources without duplicates
        const combined = [...artisansData];
        usersData.forEach((u) => {
          if (!combined.some((a) => a.id === u.id)) {
            combined.push(u);
          }
        });

        setArtisans(combined);
        setFilteredArtisans(combined);
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

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(
        (artisan) =>
          (artisan.trade || artisan.skill)?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((artisan) => {
        const nameMatch = artisan.name?.toLowerCase().includes(term);
        const tradeMatch = (artisan.trade || artisan.skill)?.toLowerCase().includes(term);
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
      <div className="p-12 flex flex-col justify-center items-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading live artisans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Search Input */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Find & Hire Skilled Artisans</h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover vetted professionals near you and send booking requests.
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
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
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto my-8">
          <p className="text-gray-500 font-medium text-sm">
            No artisans found matching your search or category filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="mt-4 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
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
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={
                      artisan.image ||
                      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300"
                    }
                    alt={artisan.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {artisan.trade || artisan.skill}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{artisan.name}</h3>
                <p className="text-xs font-medium text-gray-400 mt-0.5">📍 {artisan.location || "Abuja"}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{artisan.bio}</p>

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
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <Link
                  href={`/findartisan/${artisan.id}`}
                  className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition text-center"
                >
                  View Profile
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedArtisan(artisan);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition cursor-pointer"
                >
                  Hire Artisan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedArtisan && (
        <JobRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          artisanId={selectedArtisan.id}
          artisanName={selectedArtisan.name}
          clientId={(session?.user as any)?.id || session?.user?.email || "client-demo"}
          clientName={session?.user?.name || "Client"}
          onSuccess={() => alert("Job request submitted successfully!")}
        />
      )}
    </div>
  );
}