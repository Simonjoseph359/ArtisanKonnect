"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const snap = await getDocs(collection(db, "users"));
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(list);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Database & Approvals</h1>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">No users found in database.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="p-4 font-bold text-white">{u.fullName || u.name || "N/A"}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4 capitalize font-semibold">{u.accountType || "client"}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md font-semibold">
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}