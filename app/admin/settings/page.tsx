import React from "react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Platform Configurations</h1>
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-2xl space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Commission Rate (%)</label>
          <input type="number" defaultValue={5} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none" />
        </div>
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Support Email</label>
          <input type="email" defaultValue="support@artisankonnect.com" className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none" />
        </div>
        <button className="px-5 py-2.5 bg-emerald-500 font-bold text-white rounded-xl">Save Changes</button>
      </div>
    </div>
  );
}