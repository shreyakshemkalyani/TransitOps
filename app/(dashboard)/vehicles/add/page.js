"use client";

import PageHeader from "@/components/common/PageHeader";
import VehicleForm from "@/components/dashboard/VehicleForm";
import { useRouter } from "next/navigation";

export default function AddVehiclePage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Add Vehicle"
        description="Create a new vehicle."
      />

      <VehicleForm />
    </>
  );
}