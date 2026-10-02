"use client";

import React, { useState } from "react";
import { createJobRequest } from "@/config/job";

interface JobRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisanId: string;
  artisanName: string;
  clientId?: string;
  clientName?: string;
  onSuccess?: () => void;
}

export default function JobRequestModal({
  isOpen,
  onClose,
  artisanId,
  artisanName,
  clientId = "client_default",
  clientName = "Client User",
  onSuccess,
}: JobRequestModalProps) {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Write request directly to Firestore via config/jobs.ts
      await createJobRequest({
        clientId: clientId || "client_default",
        clientName: clientName || "Anonymous Client",
        artisanId,
        artisanName,
        service,
        location,
        date: date || new Date().toISOString().split("T")[0],
        proposedBudget,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      // 2. Reset form & close modal after confirmation
      setTimeout(() => {
        setIsSuccess(false);
        setService("");
        setLocation("");
        setDate("");
        setProposedBudget("");
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (error) {
      console.error("Failed to submit job request:", error);
      alert("Something went wrong saving your request. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">
          Request Service from {artisanName}
        </h2>

        {isSuccess ? (
          <div className="p-6 text-center space-y-2">
            <div className="text-3xl">🎉</div>
            <p className="text-emerald-600 font-bold">Request Sent Successfully!</p>
            <p className="text-xs text-gray-500">
              {artisanName} will receive your request in their portal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Service Description
              </label>
              <input
                type="text"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. AC Installation & Servicing"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-emerald-600 text-gray-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Service Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gwarinpa, Abuja"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-emerald-600 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-emerald-600 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Proposed Budget (₦)
                </label>
                <input
                  type="number"
                  required
                  value={proposedBudget}
                  onChange={(e) => setProposedBudget(e.target.value)}
                  placeholder="15000"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-emerald-600 text-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}