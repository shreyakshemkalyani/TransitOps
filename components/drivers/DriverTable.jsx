"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverTable({ drivers, setDrivers }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this driver?")) {
      const updatedDrivers = drivers.filter(driver => driver.id !== id);
      setDrivers(updatedDrivers);
      localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    }
  };

  const handleEdit = (id) => {
    router.push(`/drivers/edit/${id}`);
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "All" || driver.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="rounded-xl border border-gray-700 bg-[#111111] p-6 text-white">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
          />
        </div>
        <div className="w-full md:w-1/4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left">Driver Name</th>
              <th className="py-3 px-4 text-left">License No.</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="py-3 px-4">{driver.name}</td>
                  <td className="py-3 px-4">{driver.licenseNumber}</td>
                  <td className="py-3 px-4">{driver.category}</td>
                  <td className="py-3 px-4">{driver.contact}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      driver.status === "Available" ? "bg-green-900 text-green-300" :
                      driver.status === "On Trip" ? "bg-blue-900 text-blue-300" :
                      driver.status === "Off Duty" ? "bg-yellow-900 text-yellow-300" :
                      "bg-red-900 text-red-300"
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(driver.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 px-4 text-center text-gray-400">
                  No drivers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}