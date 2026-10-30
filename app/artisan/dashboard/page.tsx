"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import {
  FaWallet,
  FaTasks,
  FaStar,
  FaUserCheck,
  FaComments,
  FaArrowRight,
  FaEdit,
  FaEye,
  FaCheck,
  FaTrash,
  FaCamera,
} from "react-icons/fa";

interface ChatRoom {
  id: string;
  participants: string[];
  participantDetails?: Record<string, { name: string; image: string }>;
  lastMessage?: string;
  updatedAt?: any;
}

export default function ArtisanDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [profile, setProfile] = useState<any>(null);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  // Real-Time Dynamic Metrics
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [completedJobsCount, setCompletedJobsCount] = useState<number>(0);

  // Derive authenticated user identifier
  const currentUserId = (session?.user as any)?.id || session?.user?.email;

  // Form State including Profile Photo & Portfolio
  const [formData, setFormData] = useState({
    image: "",
    trade: "",
    rate: "",
    location: "",
    bio: "",
    portfolio: [] as string[],
  });

  // 1. Real-time Listener for Logged-In Artisan's Profile
  useEffect(() => {
    if (!currentUserId) {
      if (status === "unauthenticated") setLoadingProfile(false);
      return;
    }

    const artisanDocRef = doc(db, "artisans", currentUserId);
    const unsubscribe = onSnapshot(
      artisanDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({ id: docSnap.id, ...data });
          setFormData({
            image: data.image || session?.user?.image || "",
            trade: data.trade || "",
            rate: data.rate || "",
            location: data.location || "",
            bio: data.bio || "",
            portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
          });
        } else {
          // DO NOT auto-create a blank profile shell in Firestore.
          setProfile(null);
        }
        setLoadingProfile(false);
      },
      (error) => {
        console.error("Error listening to artisan profile:", error);
        setLoadingProfile(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId, status, session]);

  // 2. Real-time Listener for `jobRequests` Collection
  useEffect(() => {
    if (!currentUserId) return;

    const requestsRef = collection(db, "jobRequests");
    const q = query(requestsRef, where("artisanId", "==", currentUserId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let pending = 0;
        let completed = 0;
        let revenueSum = 0;

        snapshot.docs.forEach((docSnap) => {
          const reqData = docSnap.data();

          if (reqData.status === "pending") {
            pending += 1;
          }

          if (reqData.status === "completed") {
            completed += 1;
            const priceVal =
              reqData.proposedBudget || reqData.amount || reqData.price || 0;
            const numericPrice =
              typeof priceVal === "number"
                ? priceVal
                : Number(String(priceVal).replace(/[^0-9]/g, "")) || 0;
            revenueSum += numericPrice;
          }
        });

        setPendingRequestsCount(pending);
        setCompletedJobsCount(completed);
        setTotalRevenue(revenueSum);
      },
      (error) => {
        console.error("Error calculating live metrics:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  // 3. Real-time Listener for `chats` Collection
  useEffect(() => {
    if (!currentUserId) {
      setLoadingChats(false);
      return;
    }

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUserId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedChats: ChatRoom[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ChatRoom, "id">),
        }));

        fetchedChats.sort((a, b) => {
          const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
          const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
          return timeB - timeA;
        });

        setChats(fetchedChats);
        setLoadingChats(false);
      },
      (error) => {
        console.error("Error loading live messages:", error);
        setLoadingChats(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

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

  // Remove single portfolio image
  const handleRemovePortfolioImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Save profile edits directly to Firestore
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return;
    setSaving(true);

    try {
      const artisanDocRef = doc(db, "artisans", currentUserId);
      await setDoc(artisanDocRef, formData, { merge: true });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loadingProfile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no profile document exists yet in the 'artisans' collection
  if (!profile) {
    return (
      <div className="min-h-[75vh] flex flex-col justify-center items-center bg-gray-50 text-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            🛠️
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Create Your Artisan Profile</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            You haven't published your public artisan profile yet. Set up your specialty, location, and rates so clients can discover and hire you.
          </p>
          <Link
            href="/become-an-artisan"
            className="inline-block w-full py-3.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition shadow-sm"
          >
            Create Profile Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              profile?.image ||
              session?.user?.image ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
            }
            alt={profile?.name || "Artisan"}
            className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back, {profile?.name || session?.user?.name || "Artisan"}! 🛠️
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage your live public profile, incoming job offers, and client inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUserId && (
            <Link
              href={`/findartisan/${currentUserId}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
            >
              <FaEye /> View Public Profile
            </Link>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 flex items-center gap-1.5 transition"
          >
            <FaEdit /> {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-6"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700 pb-2 border-b border-gray-100">
            Update Public Profile & Work Portfolio
          </h2>

          {/* Profile Photo Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
              <FaCamera className="text-emerald-600" /> Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <img
                src={
                  formData.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                }
                alt="Profile Preview"
                className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
              />
              <label className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer transition inline-block">
                {uploadingProfile ? "Uploading Profile..." : "Upload New Photo"}
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

          {/* Trade, Rate & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Trade Category
              </label>
              <input
                type="text"
                placeholder="e.g. Electrical, Plumbing"
                value={formData.trade}
                onChange={(e) =>
                  setFormData({ ...formData, trade: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hourly Rate
              </label>
              <input
                type="text"
                placeholder="e.g. ₦10,000/hr"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Abuja, NG"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Bio / About Me
            </label>
            <textarea
              rows={3}
              placeholder="Tell clients about your skills and experience..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Past Work Portfolio Upload Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold uppercase text-gray-700">
              Past Work Showcase (Portfolio Photos)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Upload photos of completed jobs or previous work to showcase your craftsmanship.
            </p>

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

            {formData.portfolio.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.portfolio.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square"
                  >
                    <img
                      src={imgUrl}
                      alt={`Past work ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePortfolioImage(idx)}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-lg opacity-90 hover:opacity-100 transition shadow"
                      title="Remove image"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No past work images added yet.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || uploadingProfile || uploadingPortfolio}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <FaCheck /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Link
          href="/artisan/jobs"
          className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition cursor-pointer"
        >
          <FaTasks className="text-amber-500 text-2xl" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Requests</p>
            <p className="text-xl font-extrabold">{pendingRequestsCount} Pending</p>
          </div>
        </Link>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm">
          <FaWallet className="text-emerald-500 text-2xl" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Total Revenue</p>
            <p className="text-xl font-extrabold">₦{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm">
          <FaStar className="text-yellow-400 text-2xl" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Rating</p>
            <p className="text-xl font-extrabold">
              {profile?.rating ? `${profile.rating} ★` : "0 ★"}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm">
          <FaUserCheck className="text-blue-500 text-2xl" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Jobs Completed</p>
            <p className="text-xl font-extrabold">
              {completedJobsCount || profile?.completedJobs || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Client Messages */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FaComments className="text-emerald-600 text-lg" />
            <h2 className="text-lg font-bold text-gray-900">Client Messages</h2>
          </div>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
            {chats.length} Active Conversations
          </span>
        </div>

        {loadingChats ? (
          <div className="py-8 text-center">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-400 mt-2">Loading client messages...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No client messages received yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              When clients click "Contact Artisan" on your profile page, messages will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {chats.map((chat) => {
              const clientId = chat.participants?.find(
                (p: string) => p !== currentUserId
              );
              const clientInfo = chat.participantDetails?.[clientId || ""] || {
                name: "Client",
                image: "",
              };

              return (
                <div
                  key={chat.id}
                  onClick={() => router.push(`/chat/${chat.id}`)}
                  className="py-3.5 px-3 hover:bg-gray-50 rounded-xl transition cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={
                        clientInfo.image ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                      }
                      alt={clientInfo.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {clientInfo.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {chat.lastMessage || "Click to open conversation..."}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 shrink-0">
                    Open Chat <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}