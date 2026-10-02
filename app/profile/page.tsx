"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookmark, FiClock, FiEdit2, FiCheck } from "react-icons/fi";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"info" | "activity" | "saved">("info");
  
  // Editable profile state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "+234 801 234 5678",
    location: "Abuja, Nigeria",
    bio: "Looking for trusted professionals for home maintenance and repairs.",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Helper for generating initials if user has no Google picture
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Loading state while NextAuth checks session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // Unauthenticated state fallback
  if (status === "unauthenticated") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">Please sign in to view your profile page.</p>
        <Link
          href="/auth"
          className="px-6 py-2.5 bg-green-700 text-white rounded-xl font-medium hover:bg-green-800 transition-colors shadow-sm"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Banner & Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="h-32 sm:h-44 bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative flex items-center justify-center shrink-0">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 text-emerald-800 font-bold text-3xl flex items-center justify-center">
                    {getInitials(session?.user?.name)}
                  </div>
                )}
              </div>
              <div className="space-y-1 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {session?.user?.name || "User"}
                </h1>
                <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
                  <FiMail className="text-gray-400" /> {session?.user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/become-an-artisan"
                className="w-full sm:w-auto text-center px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl font-medium text-sm transition-colors"
              >
                Become an Artisan
              </Link>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <FiCheck className="text-emerald-600 text-lg" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        {/* Tabs Header */}
        <div className="flex border-b border-gray-200 bg-white rounded-xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === "info"
                ? "bg-green-700 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FiUser /> Personal Details
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === "activity"
                ? "bg-green-700 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FiClock /> Activity & Bookings
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === "saved"
                ? "bg-green-700 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FiBookmark /> Saved Artisans
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Manage your contact details and location.</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiEdit2 className="text-gray-500" /> Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={session?.user?.name || ""}
                        disabled
                        className="w-full px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm cursor-not-allowed"
                      />
                      <span className="text-[11px] text-gray-400 mt-0.5 block">Synced from your Google account</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={session?.user?.email || ""}
                        disabled
                        className="w-full px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Bio / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <FiUser className="text-gray-400 text-lg mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Full Name</p>
                      <p className="text-sm font-semibold text-gray-900">{session?.user?.name || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <FiMail className="text-gray-400 text-lg mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{session?.user?.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <FiPhone className="text-gray-400 text-lg mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <FiMapPin className="text-gray-400 text-lg mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.location}</p>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <FiCalendar className="text-gray-400 text-lg mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Bio / Notes</p>
                      <p className="text-sm text-gray-800">{formData.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4 text-center py-8">
              <FiClock className="mx-auto text-4xl text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-800">No Recent Service Requests</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                When you request services or hire artisans on ArtisanKonnect, your recent booking history will show up here.
              </p>
              <Link
                href="/findartisan"
                className="inline-block mt-2 px-5 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition-colors"
              >
                Find Artisans
              </Link>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-4 text-center py-8">
              <FiBookmark className="mx-auto text-4xl text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-800">No Saved Artisans Yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Bookmark your favorite plumbers, electricians, or carpenters so you can contact them quickly anytime.
              </p>
              <Link
                href="/findartisan"
                className="inline-block mt-2 px-5 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition-colors"
              >
                Browse Directory
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}