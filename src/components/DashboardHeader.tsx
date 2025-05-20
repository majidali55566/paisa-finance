"use client";
import { useAppSelector } from "@/app/hooks";
import { Button } from "./ui/button";
import { Edit, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DashboardHeader = () => {
  const { accounts, defaultAccountId } = useAppSelector(
    (state) => state.accounts
  );
  const router = useRouter();

  const handleAddtransaction = () => {
    if (accounts.length === 0) {
      toast.error("No accounts found", {
        description: "Please create account to add transactions",
      });
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/accounts/${defaultAccountId}/transactions/new`);
    }
  };
  return (
    <header className="fixed flex justify-between top-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
      <div className="w-full  px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center">
            <div
              onClick={() => router.push("/dashboard")}
              className="flex items-center cursor-pointer"
            >
              <h1 className="text-xl font-bold">
                Paisa <span className="text-gray-400">Sambhalo</span>
              </h1>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => {
                router.push("/dashboard");
              }}
              className="hidden md:flex"
              variant="outline"
            >
              <LayoutDashboard />
              dashboard
            </Button>
            <Button onClick={handleAddtransaction}>
              <Edit className="mr-2" />
              Add Transaction
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
