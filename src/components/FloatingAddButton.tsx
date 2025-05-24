"use client";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks";
import { toast } from "sonner";

export const FloatingAddButton = () => {
  const router = useRouter();
  const { accounts, defaultAccountId } = useAppSelector(
    (state) => state.accounts
  );

  const handleAddTransaction = () => {
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
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={handleAddTransaction}
        size="lg"
        className="bg-primary rounded-full w-14 h-14 p-0 shadow-lg  hover:bg-primary/90 text-white"
      >
        <Edit className="h-6 w-6" />
      </Button>
    </div>
  );
};
