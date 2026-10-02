"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import JobRequestModal from "@/components/jobRequestModal";
import { getArtisanProfile, ArtisanProfile } from "@/config/job";

export default function ArtisanPublicProfile() {
  const params = useParams();
  const artisanId = (params?.id as string) || "artisan_123";

  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getArtisanProfile(artisanId);
        if (data) {
          setArtisan(data);
        } else {
          // Fallback if no profile is in Firestore yet
          setArtisan({
            uid: artisanId,
            fullName: "David Adeleke",
            category: "Electrical Wiring & Solar Installation",
            hourlyRate: "15000",
          });
        }
      } catch (error) {
        console.error("Error loading artisan profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [artisanId]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-500 font-medium">
        Loading artisan profile...
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-500 font-medium">
        Artisan profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {artisan.fullName}
            </h1>
            <p className="text-emerald-600 font-medium">{artisan.category}</p>
            <p className="text-sm text-gray-500">Gwarinpa, Abuja</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition"
          >
            Hire Artisan
          </button>
        </div>

        <div className="flex gap-6 border-t pt-4 text-sm text-gray-600">
          <div>
            <span className="font-bold text-gray-800">Rating:</span> ★ 4.9
          </div>
          <div>
            <span className="font-bold text-gray-800">Rate:</span> ₦
            {artisan.hourlyRate
              ? Number(artisan.hourlyRate).toLocaleString()
              : "0"}{" "}
            / hr
          </div>
          <div>
            <span className="font-bold text-gray-800">Jobs:</span> 28 Completed
          </div>
        </div>
      </div>

      <JobRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artisanId={artisan.uid}
        artisanName={artisan.fullName}
        clientId="user_456"
        clientName="Ngozi Eze"
      />
    </div>
  );
}