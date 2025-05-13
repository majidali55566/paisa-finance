"use client";
import { CreateAccountDialog } from "@/components/CreateAccountDialog";

import { Ban } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../hooks";
import { changeDefaultAccount } from "../features/accounts/accountsapi";
import AccountCard from "@/components/AccountCard";
import { AccountSelect } from "@/components/AccountSelect";
import RecentTransactions from "@/components/RecentTransactions";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { accounts, fetchStatus, error, changeDefault } = useAppSelector(
    (state) => state.accounts
  );

  const handleDefaultAccountChange = async (accountId: string) => {
    try {
      const result = await dispatch(changeDefaultAccount(accountId));
      if (changeDefaultAccount.fulfilled.match(result)) {
        toast.success("Default account changed successfully");
      } else {
        toast.error(result.error?.message || "Failed to create ");
      }
    } catch (error) {
      toast.error("unexpected error occurred");
      console.log("Error changing default account", error);
    }
  };

  return (
    <div className="px-6 pt-[7rem] md:px-8  ">
      <div className="flex flex-wrap gap-4 items-start">
        <RecentTransactions />
        <CreateAccountDialog />
        {fetchStatus === "loading" ? (
          <div className="text-muted-foreground mt-6 text-center w-full">
            <p>Loading accounts...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 mt-6 w-full text-center">
            <p>Error: {error}</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground mt-6 gap-2 w-full">
            <Ban size={32} className="text-destructive" />
            <p className="text-base">No accounts found.</p>
            <p className="text-sm">
              Please create an account to get started with transactions.
            </p>
          </div>
        ) : (
          accounts.map((account) => (
            <AccountCard
              changeDefault={changeDefault}
              key={account._id}
              account={account}
              onToggleDefault={handleDefaultAccountChange}
            />
          ))
        )}
      </div>

      <div className="fixed bottom-4 right-4"></div>
    </div>
  );
};
export default Dashboard;
