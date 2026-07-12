"use client";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <span className="font-semibold text-slate-900">FleetOps</span>
      <button type="button" className="text-sm text-slate-600">Sign out</button>
    </header>
  );
}
