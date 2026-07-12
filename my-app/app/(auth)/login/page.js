import LoginForm from "@/components/auth/LoginForm";
import { Truck } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-[#0a0c10]">
      {/* Left Panel: Branding / Info */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#d2d6dc] p-12 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm">
               <Truck size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">TransitOps</h1>
              <p className="text-sm font-medium text-slate-500">Smart Transport Operations Platform</p>
            </div>
          </div>
        </div>

        <div className="max-w-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">One login, four roles:</h2>
          <ul className="space-y-3">
            {["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"].map((role) => (
              <li key={role} className="flex items-center gap-3 font-medium text-slate-700">
                <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                {role}
              </li>
            ))}
          </ul>
        </div>
        
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          TRANSITOPS © 2026 • RBAC ENABLED
        </p>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <LoginForm />
      </div>
    </main>
  );
}
