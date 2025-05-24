"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { Toaster } from "sonner";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect } from "react";
import { fetchAllAccounts } from "../features/accounts/accountsapi";
import { getAccountTransactions } from "../features/transactions/transactionsApi";
import Footer from "@/components/Footer";
import { FloatingAddButton } from "@/components/FloatingAddButton";

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
    <div className="mx-auto min-h-screen">
      <DashboardHeader />
      <main>{children}</main>
      <FloatingAddButton />
      <Toaster richColors />
      <Footer />
    </div>
  );
}
