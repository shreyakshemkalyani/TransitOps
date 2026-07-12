"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0c10] px-6">
      <div className="flex items-center gap-4">
         {/* Search or breadcrumbs could go here */}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{session?.user?.name || "Loading..."}</p>
            <p className="text-xs text-slate-400">{session?.user?.role || "Role"}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
             <UserIcon size={18} />
          </div>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
