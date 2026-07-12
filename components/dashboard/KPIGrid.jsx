import DashboardCard from "./DashboardCard";

export default function KPIGrid({ items = [] }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((item) => <DashboardCard key={item.label} {...item} />)}</div>;
}
