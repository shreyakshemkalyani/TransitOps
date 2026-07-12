"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Wrench, Plus, CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";

export default function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: "", description: "", cost: "", startDate: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, vRes] = await Promise.all([
        fetch("/api/maintenance"),
        fetch("/api/vehicles")
      ]);
      const mData = await mRes.json();
      const vData = await vRes.json();
      
      if (mData.success) setRecords(mData.records);
      if (vData.success) {
        // Only allow non-'On Trip' vehicles to be sent to maintenance
        setVehicles(vData.vehicles.filter(v => v.status !== 'On Trip'));
      }
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Maintenance log created. Vehicle moved to 'In Shop'");
        fetchData(); // Refresh all
        setIsModalOpen(false);
        setFormData({ vehicleId: "", description: "", cost: "", startDate: "" });
      } else {
        toast.error(data.message || "Failed to create record");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleClose = async (id) => {
    try {
      const res = await fetch(`/api/maintenance/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'close' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to close record");
    }
  };

  const filtered = records.filter(r => 
    r.vehicle?.name?.toLowerCase().includes(search.toLowerCase()) || 
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Maintenance Logs" description="Track vehicle servicing and repair costs." />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-500"
        >
          <Plus size={16} /> Log Maintenance
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#12141a] p-4">
        <div className="mb-4 flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by vehicle or description..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3 px-4 font-medium">Vehicle</th>
                <th className="pb-3 px-4 font-medium">Description</th>
                <th className="pb-3 px-4 font-medium">Cost ($)</th>
                <th className="pb-3 px-4 font-medium">Date</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-500">Loading records...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-500">No records found</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                        <Wrench size={14} />
                      </div>
                      {r.vehicle?.name} ({r.vehicle?.registrationNumber})
                    </td>
                    <td className="py-3 px-4 truncate max-w-xs">{r.description}</td>
                    <td className="py-3 px-4 text-white font-medium">${r.cost?.toLocaleString()}</td>
                    <td className="py-3 px-4">{new Date(r.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${r.status === 'Active' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {r.status === 'Active' && (
                        <button onClick={() => handleClose(r.id)} title="Mark Completed" className="flex items-center gap-1 p-1.5 text-green-400 hover:text-green-300 transition ml-auto">
                          <CheckCircle2 size={16} /> Close Log
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#12141a] p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-bold text-white">Log Maintenance</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">Vehicle</label>
                <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                  <option value="" disabled>-- Select Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>
                  ))}
                </select>
                <p className="text-xs text-orange-400 mt-1">Vehicle will automatically be moved to 'In Shop'</p>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">Issue Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" placeholder="e.g. Oil change and brake inspection" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Estimated Cost ($)</label>
                  <input type="number" required value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Start Date</label>
                  <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">Cancel</button>
                <button type="submit" className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500">Create Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}