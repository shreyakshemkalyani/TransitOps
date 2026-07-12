"use client";

import DriverForm from "@/components/drivers/DriverForm";
import { useParams, useRouter } from "next/navigation";

export default function EditDriverPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white p-6">
      <button
        onClick={() => router.push("/drivers")}
        className="mb-4 text-blue-400"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Edit Driver #{params.id}
      </h1>

      <DriverForm />
    </div>
  );
}