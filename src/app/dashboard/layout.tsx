import DashboardHeader from "@/components/DashboardHeader";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-padding">
      <DashboardHeader />
      <main>{children}</main>
      <Toaster richColors />
    </div>
  );
}
