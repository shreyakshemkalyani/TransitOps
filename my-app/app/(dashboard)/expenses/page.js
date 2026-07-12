"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Receipt, Plus, Search, Droplets } from "lucide-react";
import { toast } from "sonner";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category: "Fuel", amount: "", date: "", vehicleId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eRes, vRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/vehicles")
      ]);
      const eData = await eRes.json();
      const vData = await vRes.json();
      
      if (eData.success) setExpenses(eData.expenses);
      if (vData.success) setVehicles(vData.vehicles);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Expense logged successfully");
        setExpenses([data.expense, ...expenses]);
        setIsModalOpen(false);
        setFormData({ category: "Fuel", amount: "", date: "", vehicleId: "" });
      } else {
        toast.error(data.message || "Failed to log expense");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const filtered = expenses.filter(e => 
    e.category.toLowerCase().includes(search.toLowerCase()) || 
    e.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (category) => {
    if (category === 'Fuel') return <Droplets size={14} className="text-blue-400" />;
    return <Receipt size={14} className="text-emerald-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Fuel & Expenses" description="Log operational costs and track fuel consumption." />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          <Plus size={16} /> Log Expense
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#12141a] p-4">
        <div className="mb-4 flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by category or vehicle..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3 px-4 font-medium">Category</th>
                <th className="pb-3 px-4 font-medium">Vehicle</th>
                <th className="pb-3 px-4 font-medium">Amount ($)</th>
                <th className="pb-3 px-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-500">Loading expenses...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-500">No expenses found</td></tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${e.category === 'Fuel' ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`}>
                        {getIcon(e.category)}
                      </div>
                      {e.category}
                    </td>
                    <td className="py-3 px-4">{e.vehicle?.name ? `${e.vehicle.name} (${e.vehicle.registrationNumber})` : 'N/A'}</td>
                    <td className="py-3 px-4 text-white font-medium">${e.amount?.toLocaleString()}</td>
                    <td className="py-3 px-4">{new Date(e.date).toLocaleDateString()}</td>
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
            <h2 className="mb-4 text-lg font-bold text-white">Log Expense</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                  <option>Fuel</option>
                  <option>Tolls</option>
                  <option>Fines</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">Vehicle (Optional)</label>
                <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- None --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Amount ($)</label>
                  <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full rounded-md border border-white/10 bg-[#1a1d24] px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">Cancel</button>
                <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}