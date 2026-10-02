"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function BecomeArtisanPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    trade: "Electrical",
    title: "",
    location: "",
    rate: "",
    bio: "",
    skills: "",
    image: "",
  });

  // Automatically restore saved form draft or pre-fill user's name if logged in
  useEffect(() => {
    const savedDraft = localStorage.getItem("artisanDraft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    } else if (session?.user?.name) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.user?.name || "",
      }));
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check if user is authenticated; if not, save form draft and redirect to sign up
    if (status !== "authenticated") {
      localStorage.setItem("artisanDraft", JSON.stringify(formData));
      router.push("/auth?type=artisan");
      return;
    }

    setLoading(true);

    try {
      // Format skills into an array
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const newArtisan = {
        userId: session?.user?.email || "",
        name: formData.name || session?.user?.name || "Anonymous Artisan",
        trade: formData.trade,
        title: formData.title || `${formData.trade} Professional`,
        location: formData.location,
        rate: formData.rate.startsWith("₦") ? formData.rate : `₦${formData.rate}/hr`,
        bio: formData.bio,
        skills: skillsArray.length > 0 ? skillsArray : [formData.trade],
        image:
          formData.image ||
          session?.user?.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        rating: 5.0,
        reviewsCount: 0,
        verified: true,
        completedJobs: 0,
        portfolio: [],
        reviews: [],
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore "artisans" collection
      const docRef = await addDoc(collection(db, "artisans"), newArtisan);

      // Clear draft after successful creation
      localStorage.removeItem("artisanDraft");

      // Redirect directly to the newly created profile
      router.push(`/findartisan/${docRef.id}`);
    } catch (error) {
      console.error("Error creating artisan profile:", error);
      alert("Failed to create profile. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Join as an Artisan</h1>
          <p className="text-sm text-gray-500 mb-8">
            Create your profile to start connecting with local clients.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Samuel John"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                  Trade / Category
                </label>
                <select
                  name="trade"
                  value={formData.trade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Painting">Painting</option>
                  <option value="AC Repairs">AC Repairs</option>
                  <option value="Welding">Welding</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                  Hourly Rate
                </label>
                <input
                  type="text"
                  name="rate"
                  required
                  value={formData.rate}
                  onChange={handleChange}
                  placeholder="e.g. 10000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Solar & Inverter Tech"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lagos, NG"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                Bio / Summary
              </label>
              <textarea
                name="bio"
                rows={3}
                required
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your experience and services offered..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                Skills (Comma Separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Wiring, Inverters, Fault Detection"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                Profile Image URL (Optional)
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-700 transition disabled:opacity-50 mt-4"
            >
              {loading ? "Creating Profile..." : "Publish Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}