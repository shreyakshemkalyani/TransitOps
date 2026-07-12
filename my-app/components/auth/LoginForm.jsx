"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("Fleet Manager");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-sm text-slate-200">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "var(--font-sans)" }}>Sign in to your account</h2>
        <p className="text-sm text-slate-400">Enter your credentials to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
          <input 
            className="w-full rounded-md border border-white/10 bg-[#161b22] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
            type="email" 
            name="email" 
            placeholder="manager@transitops.in" 
            defaultValue="manager@transitops.in"
            required 
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
          <input 
            className="w-full rounded-md border border-white/10 bg-[#161b22] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            defaultValue="password123"
            required 
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Role (RBAC)</label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-[#161b22] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Fleet Manager">Fleet Manager</option>
            <option value="Dispatcher">Dispatcher</option>
            <option value="Safety Officer">Safety Officer</option>
            <option value="Financial Analyst">Financial Analyst</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-white/10 bg-[#161b22] text-blue-500 focus:ring-0 focus:ring-offset-0" />
            <span className="text-slate-300">Remember me</span>
          </label>
          <a href="#" className="text-blue-400 hover:text-blue-300">Forgot password?</a>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button 
          className="w-full rounded-md bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-xs text-slate-400 space-y-2 leading-relaxed">
        <p>Access is scoped by role after login:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Fleet Manager → Fleet, Maintenance</li>
          <li>Dispatcher → Dashboard, Trips</li>
          <li>Safety Officer → Drivers, Compliance</li>
          <li>Financial Analyst → Fuel & Expenses, Analytics</li>
        </ul>
      </div>
    </div>
  );
}
