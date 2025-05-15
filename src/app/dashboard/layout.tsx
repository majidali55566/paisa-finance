"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { Toaster } from "sonner";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect } from "react";
import { fetchAllAccounts } from "../features/accounts/accountsapi";
import { getAccountTransactions } from "../features/transactions/transactionsApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { defaultAccountId } = useAppSelector((state) => state.accounts);
  useEffect(() => {
    dispatch(fetchAllAccounts());
  }, []);

  useEffect(() => {
    if (defaultAccountId) {
      dispatch(getAccountTransactions({ accountId: defaultAccountId }));
    }
  });
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
      <DashboardHeader />
      <main>{children}</main>
      <Toaster richColors />
    </div>
  );
}
