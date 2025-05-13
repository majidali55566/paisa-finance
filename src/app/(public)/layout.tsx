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
      <footer className="bg-blue-100">
        <div className="container mx-auto px-4 text-center">
          <p>Made with ❤️ by Majid Ali.</p>
        </div>
      </footer>
    </div>
  );
}
