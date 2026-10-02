"use client";

import React, { useState } from "react";
import JobRequestModal from "@/components/jobRequestModal";

export default function FindArtisanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<{ id: string; name: string } | null>(null);

  const artisans = [
    { id: "artisan-101", name: "David Adeleke", skill: "Electrician", rating: "4.9 ★", location: "Gwarinpa" },
    { id: "artisan-102", name: "Emeka Johnson", skill: "Plumber", rating: "4.8 ★", location: "Maitama" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find & Hire Artisans in Abuja</h1>
        <p className="text-xs text-gray-500 mt-1">Select an artisan and send a job booking request directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {artisans.map((artisan) => (
          <div key={artisan.id} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{artisan.name}</h3>
              <p className="text-xs font-semibold text-emerald-600">{artisan.skill} • {artisan.location}</p>
              <p className="text-xs text-gray-400 mt-1">{artisan.rating}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedArtisan(artisan);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Hire Artisan
            </button>
          </div>
        ))}
      </div>

      {selectedArtisan && (
        <JobRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          artisanId={selectedArtisan.id}
          artisanName={selectedArtisan.name}
          clientId="client-demo"
          clientName="Demo Client"
          onSuccess={() => alert("Job request submitted!")}
        />
      )}
    </div>
  );
}