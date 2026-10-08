"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

interface JobRequest {
  id: string;
  artisanId: string;
  artisanName?: string;
  service: string;
  location: string;
  date: string;
  proposedBudget: string | number;
  status?: string;
  createdAt?: any;
}

export default function ClientBookingsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const userIdentifier = (session.user as any).id || session.user.email;

    const q = query(
      collection(db, "jobRequests"),
      where("clientId", "==", userIdentifier)
    );

    // ⚡ Real-time Firestore listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveData: JobRequest[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as JobRequest[];

        setRequests(liveData);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to client job requests:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [session]);

  const getStatusBadge = (status?: string) => {
    const formatted = status?.toLowerCase() || "pending";
    switch (formatted) {
      case "accepted":
      case "approved":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
            Accepted
          </span>
        );
      case "declined":
      case "rejected":
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
            Declined
          </span>
        );
      case "completed":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col justify-center items-center bg-gray-50 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Connecting live job updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Bookings</h1>
          <p className="text-xs text-gray-500 mt-1">
            Live tracking for your service requests and artisan responses
          </p>
        </div>
        <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl border border-emerald-100 flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Live Sync Active
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white p-12 border border-gray-100 rounded-2xl text-center space-y-2 shadow-sm">
          <p className="text-gray-500 font-medium text-sm">No bookings sent yet.</p>
          <p className="text-xs text-gray-400">
            Browse artisans and send a booking request to see live status updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-gray-200 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-base">
                    {request.service}
                  </h3>
                  {getStatusBadge(request.status)}
                </div>

                <p className="text-xs text-gray-600 font-medium">
                  <strong className="text-gray-800">Artisan:</strong> {request.artisanName || "Assigned Artisan"}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>📍 {request.location}</span>
                  {request.date && <span>📅 Date: {request.date}</span>}
                  <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                    Budget: ₦{Number(request.proposedBudget || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}