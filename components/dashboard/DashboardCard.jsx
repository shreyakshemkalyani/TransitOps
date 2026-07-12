export default function DashboardCard({ label, value, children }) {
  return <section className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p>{children}</section>;
}
