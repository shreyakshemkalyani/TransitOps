import PageHeader from "@/components/common/PageHeader";
import VehicleForm from "@/components/dashboard/VehicleForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function EditVehiclePage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get(`/api/vehicles/${id}`);
        if (data?.success) setVehicle(data.vehicle);
      } catch {
        // ignore for now
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <>
      <PageHeader title="Edit Vehicle" description="Update vehicle details." />
      <div className="p-4">
        <VehicleForm vehicle={vehicle} onSuccess={() => router.push("/vehicles")} />
      </div>
    </>
  );
}
