"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddTripPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    source: "", destination: "", plannedDistance: "", eta: "", 
    vehicleId: "", driverId: "", cargoWeight: ""
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const [vRes, dRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/drivers")
      ]);
      const vData = await vRes.json();
      const dData = await dRes.json();
      
      if (vData.success) {
        // Only show Available vehicles
        setVehicles(vData.vehicles.filter(v => v.status === 'Available'));
      }
      if (dData.success) {
        // Only show Available drivers with valid licenses
        setDrivers(dData.drivers.filter(d => 
          d.status === 'Available' && new Date(d.expiryDate) > new Date()
        ));
      }
    } catch (err) {
      toast.error("Failed to fetch available resources");
    } finally {
      setLoading(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedVehicle && Number(formData.cargoWeight) > selectedVehicle.capacity) {
      toast.error(`Cargo weight exceeds the maximum capacity of ${selectedVehicle.capacity}kg for this vehicle.`);
      return;
    }

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tripNumber: `TRP-${Math.floor(Math.random() * 90000) + 10000}`
        })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Trip created as Draft");
        router.push("/trips");
      } else {
        toast.error(data.message || "Failed to create trip");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/trips" className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <PageHeader title="Create New Trip" description="Plan a route and assign available vehicles and drivers." />
      </div>

      <div className="rounded-xl border border-white/5 bg-[#12141a] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500 py-10">Loading available resources...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-white/5 pb-2">Route Details</h3>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Source Location</label>
                  <input required value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" placeholder="e.g. Warehouse A" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Destination</label>
                  <input required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" placeholder="e.g. Retail Store B" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Distance (km)</label>
                    <input type="number" required value={formData.plannedDistance} onChange={e => setFormData({...formData, plannedDistance: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">ETA</label>
                    <input required value={formData.eta} onChange={e => setFormData({...formData, eta: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" placeholder="e.g. 4 hours" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-white/5 pb-2">Resource Assignment</h3>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Select Vehicle</label>
                  <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                    <option value="" disabled>-- Select Available Vehicle --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber}) - Capacity: {v.capacity}kg</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Select Driver</label>
                  <select required value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                    <option value="" disabled>-- Select Available Driver --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.category}) - Score: {d.safetyScore}%</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Cargo Weight (kg)</label>
                  <input type="number" required value={formData.cargoWeight} onChange={e => setFormData({...formData, cargoWeight: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                  {selectedVehicle && (
                    <p className={`text-xs mt-1 ${Number(formData.cargoWeight) > selectedVehicle.capacity ? 'text-red-400' : 'text-slate-500'}`}>
                      Max allowed: {selectedVehicle.capacity}kg
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
              <Link href="/trips" className="px-6 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-white/5 transition">Cancel</Link>
              <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
                Create Draft Trip
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
