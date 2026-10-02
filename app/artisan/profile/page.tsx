"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// import { getArtisanProfile, updateArtisanProfile } from "@/config/jobs";
import { getArtisanProfile, updateArtisanProfile } from "@/config/job";

export default function ArtisanProfilePage() {
  const { data: session } = useSession();
  const artisanId = session?.user?.id || "artisan_123";

  const [formData, setFormData] = useState({
    fullName: "",
    category: "",
    hourlyRate: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load profile data from Firebase when the component mounts
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getArtisanProfile(artisanId);
        if (data) {
          setFormData({
            fullName: data.fullName || "",
            category: data.category || "",
            hourlyRate: data.hourlyRate || "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [artisanId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await updateArtisanProfile(artisanId, {
        uid: artisanId,
        fullName: formData.fullName,
        category: formData.category,
        hourlyRate: formData.hourlyRate,
      });

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
      setMessage("Error updating profile. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading your profile...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Artisan Profile Settings</h1>

        {message && (
          <div
            className={`p-3 text-sm rounded-lg border ${
              message.includes("Error")
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Skill / Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate (₦)
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition disabled:opacity-50"
          >
            {isSaving ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}