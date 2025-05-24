"use client";
import { CreateAccountDialog } from "@/components/CreateAccountDialog";
import { Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  changeDefaultAccount,
  fetchAllAccounts,
} from "../features/accounts/accountsapi";
import AccountCard from "@/components/AccountCard";
import RecentTransactions from "@/components/RecentTransactions";
import { MonthlyExpensePieChart } from "@/components/MonthlyExpensePieChart";
import AccountBalanceStatics from "@/components/AccountBalanceStatics";
import { useEffect, useState } from "react";
import { Account } from "@/schemas/AccountSchema";
import EditAccountDialog from "@/components/EditAccountDialog";
import { clearAccountError } from "../features/accounts/accountSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { accounts, fetchStatus, updateStatus, error, changeDefault } =
    useAppSelector((state) => state.accounts);

  const [isEditAccountDialogOpen, setEditAccountDialogOpen] = useState(false);
  const [isAccountEditing, setAccountEditing] = useState(false);

  const { transactions } = useAppSelector((state) => state.transactions);
  const [selectedAccountForDialog, setselectedAccountForDialog] =
    useState<Account | null>(null);
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
    } finally {
      setAccountEditing(false);
    }
  };
  useEffect(() => {
    if (updateStatus === "succeeded") {
      dispatch(fetchAllAccounts());
    } else if (updateStatus === "failed") {
      dispatch(clearAccountError());
    }
  }, [updateStatus, dispatch]);

  const defaultAccount = accounts.find((acc) => acc.isDefault) || accounts[0];
  const handleEdit = (account: Account) => {
    setselectedAccountForDialog(account);
    setEditAccountDialogOpen(true);
  };
  const handleClose = () => {
    setEditAccountDialogOpen(!isEditAccountDialogOpen);
    setselectedAccountForDialog(null);
  };

  if (fetchStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl px-5 pb-5">
      <div className="grid gap-6 pt-22 md:pt-25">
        {defaultAccount && (
          <div>
            <AccountBalanceStatics
              account={defaultAccount}
              transactions={transactions}
            />
          </div>
        )}
        {selectedAccountForDialog && (
          <EditAccountDialog
            account={selectedAccountForDialog!}
            isOpen={isEditAccountDialogOpen}
            onOpenClose={handleClose}
          />
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecentTransactions />
          <MonthlyExpensePieChart />
          <CreateAccountDialog />
        </div>

        <div className="grid gap-6 pt-5">
          <h1 className="text-xl font-semibold text-center">
            Manage Your Acconts
          </h1>
          <div className="">
            {error ? (
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
              <div className="mx-auto grid items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account) => (
                  <AccountCard
                    changeDefault={changeDefault}
                    key={account._id}
                    account={account}
                    onHandleEdit={handleEdit}
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
