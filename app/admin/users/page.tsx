import React from "react";

export default function AdminUsersPage() {
  const users = [
    { id: "1", name: "David Adeleke", role: "Artisan", skill: "Electrician", status: "Verified" },
    { id: "2", name: "Ngozi Eze", role: "Client", skill: "N/A", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Database & Approvals</h1>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Skill</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-4 font-bold text-white">{u.name}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">{u.skill}</td>
                <td className="p-4"><span className="px-2 py-1 bg-emerald-900 text-emerald-300 rounded-md font-semibold">{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}