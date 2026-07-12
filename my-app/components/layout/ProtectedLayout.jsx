import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function ProtectedLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c10] text-slate-200">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-[#0a0c10] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
