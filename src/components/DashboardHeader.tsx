"use client";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const router = useRouter();

  return (
    <header className="fixed flex justify-between top-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center">
            <div
              onClick={() => router.push("/")}
              className="flex items-center cursor-pointer"
            >
              <h1 className="text-xl font-bold">
                Paisa <span className="text-gray-400">Sambhalo</span>
              </h1>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => router.push("/dashboard")}
              className=""
              variant="outline"
            >
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary">
              <p className="text-white">M</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
