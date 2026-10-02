"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getArtisanJobRequests, updateJobStatus, JobRequest, } from "@/config/job";

export default function ArtisanJobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Uses active session ID or defaults to "artisan_123" for testing
  const artisanId = session?.user?.id || "artisan_123";

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await getArtisanJobRequests(artisanId);
      setJobs(data);
    } catch (error) {
      console.error("Failed to load job requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artisanId) {
      loadJobs();
    }
  }, [artisanId]);

  const handleStatusUpdate = async (
    jobId: string,
    newStatus: "accepted" | "declined" | "completed"
  ) => {
    try {
      await updateJobStatus(jobId, newStatus);
      // Update local state instantly
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error("Failed to update job status:", error);
      alert("Could not update job status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium">
        Loading incoming job requests from Firestore...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Requests</h1>
          <p className="text-xs text-gray-500">
            Manage your incoming service requests and job statuses
          </p>
        </div>
        <button
          onClick={loadJobs}
          className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition"
        >
          Refresh Data
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
          No job requests found right now.
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4"
            >
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">
                    {job.service}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      job.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : job.status === "accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : job.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p>
                  <strong className="text-gray-800">Client:</strong>{" "}
                  {job.clientName}
                </p>
                <p>
                  <strong className="text-gray-800">Location:</strong>{" "}
                  {job.location} |{" "}
                  <strong className="text-gray-800">Date:</strong> {job.date}
                </p>
                <p className="text-emerald-600 font-bold text-sm pt-1">
                  Budget: ₦{Number(job.proposedBudget).toLocaleString()}
                </p>
              </div>

              {job.status === "pending" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      job.id && handleStatusUpdate(job.id, "declined")
                    }
                    className="px-4 py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() =>
                      job.id && handleStatusUpdate(job.id, "accepted")
                    }
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition"
                  >
                    Accept Request
                  </button>
                </div>
              )}

              {job.status === "accepted" && (
                <button
                  onClick={() =>
                    job.id && handleStatusUpdate(job.id, "completed")
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}