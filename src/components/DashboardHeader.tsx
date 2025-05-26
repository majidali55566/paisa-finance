"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";

const DashboardHeader = () => {
  const { data: session } = useSession();

  return (
    <header className="fixed flex justify-between top-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center">
            <div className="flex items-center cursor-pointer">
              <Link href="/">
                <h1 className="text-xl font-bold">
                  Paisa <span className="text-gray-400">Sambhalo</span>
                </h1>
              </Link>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Button className="" variant="outline">
              <LayoutDashboard />
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary">
              <p className="text-white">
                {session?.user?.email?.charAt(0)?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
