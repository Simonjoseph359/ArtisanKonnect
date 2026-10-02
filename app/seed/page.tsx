"use client";

import { db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

const sampleArtisans = [
  {
    id: "1",
    name: "David Adeleke",
    trade: "Electrical",
    title: "Master Electrician & Solar Installer",
    rating: 4.9,
    reviewsCount: 128,
    location: "Lagos, NG",
    rate: "₦15,000/hr",
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400",
    verified: true,
    bio: "Certified electrical engineer with over 8 years of experience in residential wiring, industrial fault detection, and solar inverter installations.",
    completedJobs: 142,
    skills: ["Residential Wiring", "Solar Inverter Installation", "Generator Repairs", "Circuit Breakers"],
    portfolio: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400",
    ],
    reviews: [
      { id: 1, client: "Bisi Akande", rating: 5, date: "2 weeks ago", comment: "Fixed our full house inverter setup quickly!" },
    ],
  },
  {
    id: "2",
    name: "Emmanuel Okafor",
    trade: "Plumbing",
    title: "Certified Plumber & Pipefitter",
    rating: 4.8,
    reviewsCount: 95,
    location: "Abuja, NG",
    rate: "₦12,000/hr",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    verified: true,
    bio: "Experienced plumber specializing in modern bathroom fittings and water heater installation.",
    completedJobs: 98,
    skills: ["Pipe Fitting", "Water Heater Installation", "Leak Detection"],
    portfolio: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
    ],
    reviews: [
      { id: 1, client: "Amina Bello", rating: 5, date: "3 days ago", comment: "Solved a persistent drain leak." },
    ],
  }
];

export default function SeedPage() {
  const [status, setStatus] = useState("");

  const seedDatabase = async () => {
    setStatus("Uploading artisans to Firestore...");
    try {
      for (const artisan of sampleArtisans) {
        await setDoc(doc(db, "artisans", artisan.id), artisan);
      }
      setStatus("Successfully populated Firebase Firestore!");
    } catch (error: any) {
      console.error(error);
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto text-center space-y-4">
      <h1 className="text-xl font-bold">Populate Firebase Firestore</h1>
      <button
        onClick={seedDatabase}
        className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-700 transition"
      >
        Upload Sample Artisans
      </button>
      {status && <p className="text-sm font-medium text-blue-600">{status}</p>}
    </div>
  );
}