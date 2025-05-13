"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "./ui/button";
import { Edit, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { fetchAllAccounts } from "@/app/features/accounts/accountsapi";

const DashboardHeader = () => {
  const dispatch = useAppDispatch();

  const { accounts, defaultAccountId } = useAppSelector(
    (state) => state.accounts
  );

  const router = useRouter();
  useEffect(() => {
    dispatch(fetchAllAccounts());
  }, [dispatch]);

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
    <header className="flex bg-white items-center justify-between  px-6 py-4 md:px-8 md:py-6 border-b-2 w-full fixed">
      <div className="flex items-center">
        <div className="flex items-center">
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
    </header>
  );
};

export default DashboardHeader;
