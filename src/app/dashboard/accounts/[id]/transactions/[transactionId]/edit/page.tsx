"use client";
import { useAppSelector } from "@/app/hooks";
import TransactionForm from "@/components/TransactionForm";
import { Transaction } from "@/schemas/TransactionSchema";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const EditTransaction = () => {
  const params = useParams();
  const { id, transactionId } = params;
  const { accounts, defaultAccountId } = useAppSelector(
    (state) => state.accounts
  );
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    async function fetchTransaction() {
      try {
        const response = await axios.get(
          `/api/accounts/${id}/transactions/${transactionId}`
        );
        if (response.status === 200) {
          console.log(response.data.transaction);
          setTransaction({
            ...response.data.transaction,
            amount: response.data.transaction.amount.toString(),
            transactionDate: new Date(
              response.data.transaction.transactionDate
            ),
          });
        }
      } catch (error) {
        console.error("Error fetching transaction", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransaction();
  }, [id, transactionId]);

  const handleSubmit = async (data: Transaction) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      const response = await axios.put(
        `/api/accounts/${id}/transactions/${transactionId}`,
        data
      );
      console.log(response.data.transaction);
      if (response.status === 200) {
        toast.success("Transaction updated successfully");
        router.back();
      }
    } catch (error) {
      console.error("Error updating transaction", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading transaction...</div>;
  }

  if (!transaction) {
    return <div className="text-center py-12">Transaction not found</div>;
  }

  return (
    <div className="mx-auto grid place-content-center py-[5rem] md:py-[6rem] max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Edit Transaction</h1>
      <TransactionForm
        accounts={accounts}
        defaultAccountId={defaultAccountId!}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        defaultValues={transaction}
        submitButtonText="Update Transaction"
      />
    </div>
  );
};

export default EditTransaction;
