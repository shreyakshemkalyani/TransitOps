"use client";

import DriverForm from "@/components/drivers/DriverForm";

export default function AddDriverPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Add Driver
      </h1>

      <DriverForm />
    </div>
  );
}