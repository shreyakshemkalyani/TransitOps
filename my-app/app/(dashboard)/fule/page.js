import PageHeader from "@/components/common/PageHeader";
import FuelTable from "@/components/fuel/FuelTable";

export default function FuelPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Fuel Management"
        description="Track all fuel logs."
        action={
          <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            + Add Fuel
          </button>
        }
      />

      <FuelTable />
    </div>
  );
}