"use client";
import { CreateAccountDialog } from "@/components/CreateAccountDialog";

import { Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../hooks";
import { changeDefaultAccount } from "../features/accounts/accountsapi";
import AccountCard from "@/components/AccountCard";
import RecentTransactions from "@/components/RecentTransactions";
import { MonthlyExpensePieChart } from "@/components/MonthlyExpensePieChart";
import AccountBalanceStatics from "@/components/AccountBalanceStatics";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { accounts, fetchStatus, error, changeDefault, defaultAccountId } =
    useAppSelector((state) => state.accounts);
  const { transactions } = useAppSelector((state) => state.transactions);

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
  const defaultAccount = accounts.find((acc) => acc.isDefault) || accounts[0];

  return (
    <div className="pt-22 md:pt-25">
      <div className="grid gap-4">
        <div>
          <AccountBalanceStatics
            account={defaultAccount}
            transactions={transactions}
          />
        </div>
        <div className="flex justify-around flex-wrap gap-4 ">
          <RecentTransactions />
          <MonthlyExpensePieChart />
          <CreateAccountDialog />
        </div>
        <div className="grid  gap-4">
          <h1 className="text-xl font-semibold">Your accounts</h1>
          <div className="flex flex-wrap gap-4 items-center">
            {fetchStatus === "loading" ? (
              <div className="text-muted-foreground mt-6 text-center w-full">
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Accounts...
                </>
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
              <div className="flex flex-wrap gap-4 mx-auto justify-center items-center">
                {accounts.map((account) => (
                  <AccountCard
                    changeDefault={changeDefault}
                    key={account._id}
                    account={account}
                    onToggleDefault={handleDefaultAccountChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
