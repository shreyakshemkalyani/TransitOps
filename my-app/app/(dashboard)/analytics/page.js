"use client";

import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetching all necessary data to compute metrics
      const [vRes, tRes, mRes, eRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/trips"),
        fetch("/api/maintenance"),
        fetch("/api/expenses")
      ]);
      const vData = await vRes.json();
      const tData = await tRes.json();
      const mData = await mRes.json();
      const eData = await eRes.json();

      if (vData.success && tData.success && mData.success && eData.success) {
        processAnalytics(vData.vehicles, tData.trips, mData.records, eData.expenses);
      }
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (vehicles, trips, maintenance, expenses) => {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
    const fleetUtilization = totalVehicles ? ((activeVehicles / totalVehicles) * 100).toFixed(1) : 0;

    const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
    const totalFuelCost = expenses.filter(e => e.category === 'Fuel').reduce((sum, e) => sum + e.amount, 0);
    const operationalCost = totalMaintenanceCost + totalFuelCost;

    // ROI per vehicle (mock revenue since we don't track trip revenue)
    // Formula: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    const vehicleData = vehicles.map(v => {
      const vMaintenance = maintenance.filter(m => m.vehicleId === v.id).reduce((sum, m) => sum + m.cost, 0);
      const vFuel = expenses.filter(e => e.vehicleId === v.id && e.category === 'Fuel').reduce((sum, e) => sum + e.amount, 0);
      const mockRevenue = v.odometer * 2.5; // Example: $2.5 per km driven
      const roi = v.acquisitionCost ? (((mockRevenue - (vMaintenance + vFuel)) / v.acquisitionCost) * 100).toFixed(1) : 0;
      
      return {
        name: v.registrationNumber,
        roi: Number(roi),
        cost: vMaintenance + vFuel
      };
    }).slice(0, 5); // top 5

    // Trips over time (mocked for visual)
    const tripTrends = [
      { name: 'Mon', trips: 12 },
      { name: 'Tue', trips: 19 },
      { name: 'Wed', trips: 15 },
      { name: 'Thu', trips: 22 },
      { name: 'Fri', trips: Number(trips.length) || 5 },
      { name: 'Sat', trips: 10 },
      { name: 'Sun', trips: 8 },
    ];

    setData({
      fleetUtilization,
      operationalCost,
      totalFuelCost,
      vehicleData,
      tripTrends
    });
  };

  const exportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    
    toast.loading("Generating PDF...", { id: "pdf-export" });
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#0f1115" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("TransitOps_Analytics_Report.pdf");
      toast.success("PDF Downloaded successfully", { id: "pdf-export" });
    } catch (error) {
      toast.error("Failed to generate PDF", { id: "pdf-export" });
    }
  };

  const exportCSV = () => {
    if (!data) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Fleet Utilization (%),${data.fleetUtilization}\n`
      + `Total Operational Cost ($),${data.operationalCost}\n`
      + `Total Fuel Cost ($),${data.totalFuelCost}\n\n`
      + "Vehicle Registration,ROI (%),Total Cost ($)\n"
      + data.vehicleData.map(v => `${v.name},${v.roi},${v.cost}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TransitOps_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Reports & Analytics" description="Gain insights into fleet performance, costs, and ROI." />
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 rounded-md border border-white/10 bg-[#12141a] px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5">
            <FileText size={16} /> CSV
          </button>
          <button onClick={exportPDF} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {loading || !data ? (
        <div className="rounded-xl border border-white/5 bg-[#12141a] p-10 text-center text-slate-500">
          Loading analytics...
        </div>
      ) : (
        <div ref={reportRef} className="space-y-6 bg-[#0f1115] p-2">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-[#12141a] p-5">
              <p className="text-sm font-medium text-slate-400">Fleet Utilization</p>
              <h3 className="mt-2 text-3xl font-bold text-white">{data.fleetUtilization}%</h3>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#12141a] p-5">
              <p className="text-sm font-medium text-slate-400">Operational Cost (Fuel + Maint)</p>
              <h3 className="mt-2 text-3xl font-bold text-red-400">${data.operationalCost.toLocaleString()}</h3>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#12141a] p-5">
              <p className="text-sm font-medium text-slate-400">Total Fuel Logged</p>
              <h3 className="mt-2 text-3xl font-bold text-blue-400">${data.totalFuelCost.toLocaleString()}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Vehicle ROI Chart */}
            <div className="rounded-xl border border-white/5 bg-[#12141a] p-5">
              <h3 className="mb-4 text-base font-semibold text-white">Vehicle ROI (%)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.vehicleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e37" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#1e2128'}} contentStyle={{backgroundColor: '#1e2128', border: '1px solid #333', borderRadius: '8px'}} />
                    <Bar dataKey="roi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trip Trends Chart */}
            <div className="rounded-xl border border-white/5 bg-[#12141a] p-5">
              <h3 className="mb-4 text-base font-semibold text-white">Weekly Trip Volume</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.tripTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e37" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#1e2128', border: '1px solid #333', borderRadius: '8px'}} />
                    <Line type="monotone" dataKey="trips" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
