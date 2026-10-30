"use client";

import React, { useState, useEffect } from "react";
import { FaUsers, FaTools, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    artisansCount: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // 1. Fetch Total Users
        const usersSnap = await getDocs(collection(db, "users"));
        const totalUsers = usersSnap.size;

        // 2. Fetch Total Artisans Profiles
        const artisansSnap = await getDocs(collection(db, "artisans"));
        const artisansCount = artisansSnap.size;

        // 3. Fetch Completed Jobs & Revenue from 'jobRequests' collection
        const jobsSnap = await getDocs(collection(db, "jobRequests"));
        let completedCount = 0;
        let revenueSum = 0;

        jobsSnap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.status === "completed" || data.status === "disbursed") {
            completedCount += 1;
            
            // Calculate platform fee safely (using explicit fee or falling back to 10% of total amount)
            const totalAmount = Number(data.proposedBudget || data.amount || data.price || 1200);
            const fee = data.platformFee ? Number(data.platformFee) : totalAmount * 0.1;
            revenueSum += fee;
          }
        });

        setStats({
          totalUsers,
          artisansCount,
          completedBookings: completedCount,
          totalRevenue: revenueSum,
        });
      } catch (error) {
        console.error("Error fetching admin metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Platform Control Metrics</h1>
        <p className="text-xs text-slate-400 mt-1">Overview of live platform statistics and activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center gap-4">
          <FaUsers className="text-2xl text-blue-400" />
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Users</p>
            <p className="text-2xl font-extrabold text-white">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center gap-4">
          <FaTools className="text-2xl text-amber-400" />
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Artisans</p>
            <p className="text-2xl font-extrabold text-white">{stats.artisansCount}</p>
          </div>
        </div>
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center gap-4">
          <FaCheckCircle className="text-2xl text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Bookings Completed</p>
            <p className="text-2xl font-extrabold text-white">{stats.completedBookings}</p>
          </div>
        </div>
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center gap-4">
          <FaMoneyBillWave className="text-2xl text-purple-400" />
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Platform Revenue</p>
            <p className="text-2xl font-extrabold text-white">₦{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}