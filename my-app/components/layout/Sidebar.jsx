"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Dashboard", "/dashboard"], ["Analytics", "/analytics"], ["Vehicles", "/vehicles"],
  ["Drivers", "/drivers"], ["Trips", "/trips"], ["Maintenance", "/maintenance"], ["Expenses", "/expenses"],
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <nav className="space-y-1">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className={`block rounded-md px-3 py-2 text-sm ${pathname === href ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
