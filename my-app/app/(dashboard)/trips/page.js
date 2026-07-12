"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Navigation, Plus, Search, CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/trips");
      const data = await res.json();
      if (data.success) {
        setTrips(data.trips);
      }
    } catch (err) {
      toast.error("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchTrips(); // Refresh to get updated statuses
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to perform action");
    }
  };

  const filteredTrips = trips.filter(t => 
    t.tripNumber?.toLowerCase().includes(search.toLowerCase()) || 
    t.source?.toLowerCase().includes(search.toLowerCase()) ||
    t.destination?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (s) => {
    switch (s) {
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Dispatched': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Draft': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Trip Management" description="Monitor active deliveries, dispatch vehicles, and track cargo." />
        <Link 
          href="/trips/add"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          <Plus size={16} /> Create Trip
        </Link>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#12141a] p-4">
        <div className="mb-4 flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Trip No, Source or Destination..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3 px-4 font-medium">Trip No.</th>
                <th className="pb-3 px-4 font-medium">Route</th>
                <th className="pb-3 px-4 font-medium">Vehicle</th>
                <th className="pb-3 px-4 font-medium">Driver</th>
                <th className="pb-3 px-4 font-medium">Cargo (kg)</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-500">Loading trips...</td></tr>
              ) : filteredTrips.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-500">No trips found</td></tr>
              ) : (
                filteredTrips.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                        <Navigation size={14} />
                      </div>
                      {t.tripNumber}
                    </td>
                    <td className="py-3 px-4">{t.source} → {t.destination}</td>
                    <td className="py-3 px-4">{t.vehicleRel?.name || t.vehicleId}</td>
                    <td className="py-3 px-4">{t.driverRel?.name || t.driverId}</td>
                    <td className="py-3 px-4 text-white">{t.cargoWeight}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.status === 'Draft' && (
                          <button onClick={() => handleAction(t.id, 'dispatch')} title="Dispatch Trip" className="p-1.5 text-blue-400 hover:text-blue-300 transition">
                            <PlayCircle size={18} />
                          </button>
                        )}
                        {t.status === 'Dispatched' && (
                          <button onClick={() => handleAction(t.id, 'complete')} title="Complete Trip" className="p-1.5 text-green-400 hover:text-green-300 transition">
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {(t.status === 'Draft' || t.status === 'Dispatched') && (
                          <button onClick={() => handleAction(t.id, 'cancel')} title="Cancel Trip" className="p-1.5 text-red-400 hover:text-red-300 transition">
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}