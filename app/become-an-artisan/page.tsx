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
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    trade: "Electrical",
    customTrade: "", // State for custom trade input when "Others" is selected
    title: "",
    location: "",
    rate: "",
    bio: "",
    skills: "",
    image: "",
    portfolio: [] as string[],
  });

  // Restore saved form draft or pre-fill user's name if logged in
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

  // Helper for uploading single/multiple files to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzshagot";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "artisankonnect_preset";

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await res.json();
    return data.secure_url || null;
  };

  // Profile Image Upload Handler
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfile(true);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        setFormData((prev) => ({ ...prev, image: url }));
      } else {
        alert("Profile image upload failed.");
      }
    } catch (error) {
      console.error("Cloudinary profile upload error:", error);
      alert("Failed to upload profile image.");
    } finally {
      setUploadingProfile(false);
    }
  };

  // Portfolio Images Upload Handler (Supports multiple files at once)
  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPortfolio(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => Boolean(url));

      setFormData((prev) => ({
        ...prev,
        portfolio: [...prev.portfolio, ...validUrls],
      }));
    } catch (error) {
      console.error("Cloudinary portfolio upload error:", error);
      alert("Failed to upload project photos.");
    } finally {
      setUploadingPortfolio(false);
    }
  };

  // Remove single portfolio image from draft
  const handleRemovePortfolioImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== "authenticated") {
      localStorage.setItem("artisanDraft", JSON.stringify(formData));
      router.push("/auth?type=artisan");
      return;
    }

    setLoading(true);

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      // Resolve final trade: use customTrade if "Others" selected, else selected trade
      const finalTrade =
        formData.trade === "Others"
          ? formData.customTrade.trim() || "General Artisan"
          : formData.trade;

      const newArtisan = {
        userId: session?.user?.email || "",
        name: formData.name || session?.user?.name || "Anonymous Artisan",
        trade: finalTrade,
        title: formData.title || `${finalTrade} Professional`,
        location: formData.location,
        rate: formData.rate.startsWith("₦") ? formData.rate : `₦${formData.rate}/hr`,
        bio: formData.bio,
        skills: skillsArray.length > 0 ? skillsArray : [finalTrade],
        image:
          formData.image ||
          session?.user?.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        rating: 5.0,
        reviewsCount: 0,
        verified: true,
        completedJobs: 0,
        portfolio: formData.portfolio,
        reviews: [],
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "artisans"), newArtisan);
      localStorage.removeItem("artisanDraft");
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
              {/* TRADE DROPDOWN WITH CUSTOM 'OTHERS' OPTION */}
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
                  <option value="Others">Others</option>
                </select>

                {/* CONDITIONAL INPUT FOR 'OTHERS' */}
                {formData.trade === "Others" && (
                  <input
                    type="text"
                    name="customTrade"
                    required
                    value={formData.customTrade}
                    onChange={handleChange}
                    placeholder="Specify your trade (e.g. Tiler, Mason)"
                    className="w-full px-4 py-3 mt-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm animate-fadeIn"
                  />
                )}
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

            {/* PROFILE PHOTO UPLOAD */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                Profile Photo
              </label>

              <div className="flex items-center gap-4">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                    No Photo
                  </div>
                )}

                <label className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer transition inline-block">
                  {uploadingProfile ? "Uploading Profile..." : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    disabled={uploadingProfile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* PORTFOLIO / PAST WORK SHOWCASE UPLOAD */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Portfolio / Past Work Showcase
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload photos of completed jobs or previous work to showcase your craftsmanship to potential clients.
              </p>

              <div className="space-y-3">
                <label className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-dashed border-emerald-300 cursor-pointer transition flex items-center justify-center gap-2">
                  <span>{uploadingPortfolio ? "Uploading Projects..." : "＋ Add Project Photos (Select Multiple)"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePortfolioUpload}
                    disabled={uploadingPortfolio}
                    className="hidden"
                  />
                </label>

                {formData.portfolio.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {formData.portfolio.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
                        <img
                          src={imgUrl}
                          alt={`Project ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[10px] w-5 h-5 flex items-center justify-center shadow opacity-90 hover:opacity-100 transition"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploadingProfile || uploadingPortfolio}
              className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-700 transition disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? "Creating Profile..." : "Publish Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}