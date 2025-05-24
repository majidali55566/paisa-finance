"use client";

import { CreateTransaction } from "@/schemas/TransactionSchema";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { createTransaction } from "@/app/features/transactions/transactionsApi";
import { toast } from "sonner";
import TransactionForm from "@/components/TransactionForm";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const AddTransactionPage = () => {
  const { accounts, defaultAccountId, fetchStatus } = useAppSelector(
    (state) => state.accounts
  );
  const dispatch = useAppDispatch();
  const { addTransactionStatus } = useAppSelector(
    (state) => state.transactions
  );

  const [isReady, setisReady] = useState(false);

  useEffect(() => {
    if (fetchStatus === "succeeded") setisReady(true);
  }, [fetchStatus]);

  const router = useRouter();

  const onSubmit = async (data: CreateTransaction) => {
    console.log(data);
    try {
      const result = await dispatch(createTransaction(data));

      if (createTransaction.fulfilled.match(result)) {
        toast.success("Transaction created successfully");
        router.push("/dashboard");
      } else {
        toast.error(result.error?.message || "Transaction creation failed");
      }
    } catch (error) {
      console.log("Error add transactions", error);
      toast.error("Transaction creation failed");
    }
  };

  if (!isReady) return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  return (
    <div className="grid justify-center pt-[7rem] pb-6">
      <h1 className="text-2xl font-bold mb-6">Add Transaction</h1>
      <TransactionForm
        accounts={accounts}
        defaultAccountId={defaultAccountId || undefined}
        onSubmit={onSubmit}
        isSubmitting={addTransactionStatus === "loading"}
      />
    </div>
  );
};

export default AddTransactionPage;
