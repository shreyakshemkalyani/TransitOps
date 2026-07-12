"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddDriverForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    category: "",
    contact: "",
    status: "Available"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.licenseNumber || !formData.contact) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Send data to backend API
      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add driver');
      }
      
      // Reset form
      setFormData({
        name: "",
        licenseNumber: "",
        category: "",
        contact: "",
        status: "Available"
      });
      
      setError("");
      
      // Redirect to drivers list page
      router.push("/drivers");
    } catch (err) {
      setError(err.message || "Failed to add driver. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-[#111111] p-6 text-white">
      <h2 className="mb-6 text-xl font-bold">Add New Driver</h2>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-900/50 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Driver Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            placeholder="Enter driver's full name"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">License Number *</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            placeholder="Enter license number"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
          >
            <option value="">Select Category</option>
            <option value="Class A">Class A</option>
            <option value="Class B">Class B</option>
            <option value="Class C">Class C</option>
            <option value="CDL">CDL</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Phone Number *</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-blue-600 hover:bg-blue-700 px-6 py-2 font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Adding Driver...' : 'Add Driver'}
          </button>
          <button
            type="button"
            onClick={() => router.push("/drivers")}
            className="rounded-md border border-gray-600 hover:border-gray-500 px-6 py-2 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}