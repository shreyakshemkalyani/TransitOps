import PageHeader from "@/components/common/PageHeader";
import MaintenanceTable from "@/components/maintenance/MaintenanceTable";

export default function MaintenancePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Maintenance Management"
        description="Track and manage vehicle maintenance."
        action={
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            + Add Maintenance
          </button>
        }
      />

      <MaintenanceTable />
    </div>
  );
}