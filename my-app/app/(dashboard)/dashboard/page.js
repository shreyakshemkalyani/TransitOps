"use client";

import { useEffect, useState } from "react";
import { Truck, Navigation, AlertTriangle, Users, Calendar, Activity, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [vehicleType, setVehicleType] = useState('All');
  const [status, setStatus] = useState('All');
  const [region, setRegion] = useState('All');

  useEffect(() => {
    // In a real scenario, we'd pass filters to the API
    const params = new URLSearchParams({ vehicleType, status, region });
    fetch(`/api/dashboard?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [vehicleType, status, region]);

  if (loading && !data) {
    return <div className="flex h-full items-center justify-center text-slate-400">Loading dashboard...</div>;
  }

  const stats = data?.stats || {};
  const recentTrips = data?.recentTrips || [];
  const charts = data?.charts || { statusDistribution: [], monthlyExpenses: [] };

  // Mock chart data for Fleet Utilization
  const utilData = [
    { name: 'Mon', utilization: 65 }, { name: 'Tue', utilization: 72 }, { name: 'Wed', utilization: 81 },
    { name: 'Thu', utilization: 75 }, { name: 'Fri', utilization: 85 }, { name: 'Sat', utilization: 60 }, { name: 'Sun', utilization: 45 },
  ];

  const pieColors = ['#3b82f6', '#22c55e', '#f97316', '#ef4444'];

  const getStatusColor = (s) => {
    switch (s) {
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'On Trip': case 'Dispatched': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Draft': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Fleet Overview</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-md bg-[#12141a] px-3 py-1.5 border border-white/5">
            <Filter size={14} className="text-slate-400" />
            <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="bg-transparent text-sm text-slate-300 focus:outline-none">
              <option value="All">Type: All</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-[#12141a] px-3 py-1.5 border border-white/5">
            <select value={status} onChange={e => setStatus(e.target.value)} className="bg-transparent text-sm text-slate-300 focus:outline-none">
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-[#12141a] px-3 py-1.5 border border-white/5">
            <select value={region} onChange={e => setRegion(e.target.value)} className="bg-transparent text-sm text-slate-300 focus:outline-none">
              <option value="All">Region: All</option>
              <option value="North">North</option>
              <option value="South">South</option>
            </select>
          </div>
          <button className="rounded-md bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300 hover:bg-white/10 transition">
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[
          { label: "Active Vehicles", value: stats.activeVehicles, icon: Truck, color: "text-blue-400" },
          { label: "Available", value: stats.availableVehicles, icon: Activity, color: "text-green-400" },
          { label: "In Shop", value: stats.vehiclesInShop, icon: AlertTriangle, color: "text-orange-400" },
          { label: "Active Trips", value: stats.activeTrips, icon: Navigation, color: "text-indigo-400" },
          { label: "Pending Trips", value: stats.pendingTrips, icon: Calendar, color: "text-yellow-400" },
          { label: "Drivers Duty", value: stats.driversOnDuty, icon: Users, color: "text-purple-400" },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-xl border border-white/5 bg-[#12141a] p-5 shadow-sm transition hover:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{kpi.label}</span>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <div className="mt-4 text-3xl font-bold text-white">{kpi.value || 0}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Fleet Utilization Chart */}
        <div className="rounded-xl border border-white/5 bg-[#12141a] p-6">
          <h2 className="mb-4 font-semibold text-white">Fleet Utilization (%)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e37" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="utilization" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Status Distribution */}
        <div className="rounded-xl border border-white/5 bg-[#12141a] p-6">
          <h2 className="mb-4 font-semibold text-white">Vehicle Status</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.statusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {charts.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Expenses Chart */}
        <div className="rounded-xl border border-white/5 bg-[#12141a] p-6">
          <h2 className="mb-4 font-semibold text-white">Monthly Expenses ($)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyExpenses} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e37" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="amount" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="rounded-xl border border-white/5 bg-[#12141a] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Trips</h2>
          <button className="text-sm font-medium text-blue-400 hover:text-blue-300">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Trip No.</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Driver</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentTrips.length === 0 ? (
                <tr><td colSpan="5" className="py-4 text-center text-slate-500">No recent trips</td></tr>
              ) : recentTrips.map((trip) => (
                <tr key={trip.id}>
                  <td className="py-3 font-medium text-white">{trip.tripNumber || trip.id.substring(0, 8)}</td>
                  <td className="py-3">{trip.vehicleRel ? trip.vehicleRel.name : (trip.vehicle || 'Unassigned')}</td>
                  <td className="py-3">{trip.driverRel ? trip.driverRel.name : (trip.driver || 'Unassigned')}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">{trip.eta || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
