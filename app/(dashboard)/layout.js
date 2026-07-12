import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function DashboardLayout({ children }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
