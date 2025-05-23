import Footer from "@/components/Footer";
import PublicHeader from "@/components/PublicHeader";
import { Toaster } from "sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <PublicHeader />
      <main>{children}</main>
      <Toaster richColors />
      <Footer />
    </div>
  );
}
