"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Users, Plus, Search, Edit2, Trash2, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", licenseNo: "", category: "Heavy", expiryDate: "", contactNumber: "", status: "Available"
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/drivers");
      const data = await res.json();
      if (data.success) {
        setDrivers(data.drivers);
      }
    } catch (err) {
      toast.error("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.licenseNo.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (s) => {
    switch (s) {
      case 'Available': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'On Trip': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Off Duty': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Suspended': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Driver registered successfully");
        setDrivers([data.driver, ...drivers]);
        setIsModalOpen(false);
        setFormData({ name: "", licenseNo: "", category: "Heavy", expiryDate: "", contactNumber: "", status: "Available" });
      } else {
        toast.error(data.message || "Failed to add driver");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    try {
      const res = await fetch(`/api/drivers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Driver deleted");
        setDrivers(drivers.filter(d => d.id !== id));
      } else {
        toast.error("Cannot delete driver (active records exist)");
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Driver Management" description="Manage driver profiles, licenses, and safety scores." />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          <Plus size={16} /> Register Driver
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#12141a] p-4">
        <div className="mb-4 flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or license..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3 px-4 font-medium">Name</th>
                <th className="pb-3 px-4 font-medium">License No.</th>
                <th className="pb-3 px-4 font-medium">Category</th>
                <th className="pb-3 px-4 font-medium">License Expiry</th>
                <th className="pb-3 px-4 font-medium">Safety Score</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-500">Loading drivers...</td></tr>
              ) : filteredDrivers.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-500">No drivers found</td></tr>
              ) : (
                filteredDrivers.map((d) => {
                  const expired = isExpired(d.expiryDate);
                  return (
                    <tr key={d.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 font-medium text-white flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                          <Users size={14} />
                        </div>
                        {d.name}
                      </td>
                      <td className="py-3 px-4">{d.licenseNo}</td>
                      <td className="py-3 px-4">{d.category}</td>
                      <td className="py-3 px-4">
                        <span className={`flex items-center gap-1.5 ${expired ? 'text-red-400 font-medium' : 'text-slate-300'}`}>
                          {expired ? <ShieldAlert size={14} /> : <ShieldCheck size={14} className="text-green-400" />}
                          {new Date(d.expiryDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white font-medium">{d.safetyScore || 100}%</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(d.status)}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-white transition"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(d.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#12141a] p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-bold text-white">Register New Driver</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">License Number</label>
                <input required value={formData.licenseNo} onChange={e => setFormData({...formData, licenseNo: e.target.value})} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                    <option>Heavy</option>
                    <option>Light</option>
                    <option>Hazardous</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Expiry Date</label>
                  <input type="date" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">Contact Number</label>
                <input required value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">Cancel</button>
                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Save Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
