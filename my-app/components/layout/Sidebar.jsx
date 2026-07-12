"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Users, Route, Wrench, ReceiptText, BarChart3, Settings } from "lucide-react";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Fleet", href: "/vehicles", icon: Truck },
  { label: "Drivers", href: "/drivers", icon: Users },
  { label: "Trips", href: "/trips", icon: Route },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Fuel & Expenses", href: "/expenses", icon: ReceiptText },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-[#0a0c10] md:flex">
      <div className="flex h-16 items-center px-6 border-b border-white/5">
        <span className="text-xl font-bold tracking-tight text-white">Transit<span className="text-blue-500">Ops</span></span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link 
              key={href} 
              href={href} 
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-blue-500/10 text-blue-400 shadow-[inset_2px_0_0_0_#3b82f6]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Icon size={18} className={isActive ? "text-blue-400" : "text-slate-500"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
