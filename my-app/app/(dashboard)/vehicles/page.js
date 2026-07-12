"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Truck, Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: "", name: "", type: "Truck", capacity: "", odometer: "", acquisitionCost: "", status: "Available"
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      if (data.success) {
        setVehicles(data.vehicles);
      }
    } catch (err) {
      toast.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.registrationNumber.toLowerCase().includes(search.toLowerCase()) || 
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (s) => {
    switch (s) {
      case 'Available': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'On Trip': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Shop': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Retired': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Vehicle registered successfully");
        setVehicles([data.vehicle, ...vehicles]);
        setIsModalOpen(false);
        setFormData({ registrationNumber: "", name: "", type: "Truck", capacity: "", odometer: "", acquisitionCost: "", status: "Available" });
      } else {
        toast.error(data.message || "Failed to add vehicle");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Vehicle deleted");
        setVehicles(vehicles.filter(v => v.id !== id));
      } else {
        toast.error("Cannot delete vehicle (active records exist)");
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Vehicle Registry" description="Manage your fleet assets, track status and capacity." />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          <Plus size={16} /> Register Vehicle
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#12141a] p-4">
        <div className="mb-4 flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by registration or name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3 px-4 font-medium">Reg No.</th>
                <th className="pb-3 px-4 font-medium">Name / Model</th>
                <th className="pb-3 px-4 font-medium">Type</th>
                <th className="pb-3 px-4 font-medium">Capacity (kg)</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-500">Loading vehicles...</td></tr>
              ) : filteredVehicles.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-500">No vehicles found</td></tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-medium text-white">{v.registrationNumber}</td>
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                        <Truck size={14} />
                      </div>
                      {v.name}
                    </td>
                    <td className="py-3 px-4">{v.type}</td>
                    <td className="py-3 px-4">{v.capacity.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-white transition"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(v.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition"><Trash2 size={14} /></button>
                      </div>
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
            <h2 className="mb-4 text-lg font-bold text-white">Register New Vehicle</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">Registration Number</label>
                <input required value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">Vehicle Name / Model</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                    <option>Truck</option>
                    <option>Van</option>
                    <option>Trailer</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Capacity (kg)</label>
                  <input type="number" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">Cancel</button>
                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
