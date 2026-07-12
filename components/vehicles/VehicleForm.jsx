"use client";

import { useState } from "react";

export default function VehicleForm() {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    status: "Available",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingVehicles =
      JSON.parse(localStorage.getItem("vehicles")) || [];

    const newVehicle = {
      id: Date.now(),
      registrationNumber: formData.registrationNumber,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      status: formData.status,
    };

    localStorage.setItem(
      "vehicles",
      JSON.stringify([...existingVehicles, newVehicle])
    );

    alert("Vehicle Added Successfully");

    window.location.href = "/vehicles";
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-black p-6 text-white">
      <h2 className="mb-6 text-2xl font-bold">
        Add Vehicle
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          onChange={handleChange}
          className="rounded border border-gray-700 bg-[#111] p-3"
          required
        />

        <input
          type="text"
          name="make"
          placeholder="Make"
          onChange={handleChange}
          className="rounded border border-gray-700 bg-[#111] p-3"
          required
        />

        <input
          type="text"
          name="model"
          placeholder="Model"
          onChange={handleChange}
          className="rounded border border-gray-700 bg-[#111] p-3"
          required
        />

        <input
          type="number"
          name="year"
          placeholder="Year"
          onChange={handleChange}
          className="rounded border border-gray-700 bg-[#111] p-3"
          required
        />

        <select
          name="status"
          onChange={handleChange}
          className="rounded border border-gray-700 bg-[#111] p-3"
        >
          <option>Available</option>
          <option>On Trip</option>
          <option>In Shop</option>
          <option>Retired</option>
        </select>

        <button
          type="submit"
          className="rounded bg-orange-600 py-3"
        >
          Save Vehicle
        </button>
      </form>
    </div>
  );
}