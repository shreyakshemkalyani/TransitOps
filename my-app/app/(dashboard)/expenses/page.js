import PageHeader from "@/components/common/PageHeader";
import ExpenseTable from "@/components/expenses/ExpenseTable";

export default function ExpensePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Expense Management"
        description="Track all operational expenses."
        action={
          <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
            + Add Expense
          </button>
        }
      />

      <ExpenseTable />
    </div>
  );
}