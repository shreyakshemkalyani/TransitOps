"use client";

import { useState } from "react";

export default function DriverForm() {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    category: "LMV",
    phone: "",
    licenseExpiry: "",
    status: "Available",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "Driver name is required";

    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";

    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";

    if (!formData.licenseExpiry)
      newErrors.licenseExpiry = "License expiry is required";

    if (
      formData.licenseExpiry &&
      new Date(formData.licenseExpiry) < new Date()
    ) {
      newErrors.licenseExpiry = "License has expired";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const existingDrivers =
      JSON.parse(localStorage.getItem("drivers")) || [];

    const newDriver = {
      id: Date.now(),
      name: formData.name,
      licenseNumber: formData.licenseNumber,
      category: formData.category,
      expiry: formData.licenseExpiry,
      contact: formData.phone,
      tripCompletion: "0%",
      safety: formData.status,
      status: formData.status,
    };

    localStorage.setItem(
      "drivers",
      JSON.stringify([...existingDrivers, newDriver])
    );

    alert("Driver Added Successfully");

    window.location.href = "/drivers";
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-[#111111] p-6 text-white">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2">
              Driver Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              License Number
            </label>

            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            />

            {errors.licenseNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.licenseNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            >
              <option>LMV</option>
              <option>HMV</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              License Expiry
            </label>

            <input
              type="date"
              name="licenseExpiry"
              value={formData.licenseExpiry}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            />

            {errors.licenseExpiry && (
              <p className="text-red-500 text-sm mt-1">
                {errors.licenseExpiry}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] p-3"
            >
              <option>Available</option>
              <option>On Trip</option>
              <option>Off Duty</option>
              <option>Suspended</option>
            </select>
          </div>

        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded-md bg-orange-600 px-6 py-3 hover:bg-orange-700"
          >
            Save Driver
          </button>
        </div>
      </form>
    </div>
  );
}