"use client";
import AccountBalanceManager from "@/components/AccountBalanceStatics";
import { Account } from "@/schemas/AccountSchema";
import { Transaction } from "@/schemas/TransactionSchema";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { TransactionsTable } from "@/components/TransactionsTable";
import { TransactionConfirmationDialog } from "@/components/TransactionConfirmationDailog";

export default function AccountPage() {
  const params = useParams();
  const accountId = params?.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteTransactionDialongOpen, setIsDeleteTransactionDialongOpen] =
    useState(false);

  const [TransactionForDeletion, setTransactionForDeletion] = useState("");

  const [isDeleteTransactionLoading, setisDeleteTransactionLoading] =
    useState(false);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const [accountResponse, transactionsResponse] = await Promise.all([
        axios.get<{ account: Account }>(`/api/accounts/${accountId}`),
        axios.get<{ transactions: Transaction[] }>(
          `/api/accounts/${accountId}/transactions`
        ),
      ]);

      setAccount(accountResponse.data.account);
      setTransactions(transactionsResponse.data.transactions);
    } catch (err) {
      console.error("Error fetching account data:", err);
      setError("Failed to load account data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAccountData();
    }
  }, [accountId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-8">
        <p>Account not found</p>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleteTransactionDialongOpen(true);
    setisDeleteTransactionLoading(true);
    try {
      const response = await axios.delete(
        `/api/accounts/${account._id}/transactions/${TransactionForDeletion}`
      );
      if (response.status === 200) {
        setTransactions((prev) =>
          prev.filter((trns) => trns._id !== TransactionForDeletion)
        );
        await fetchAccountData();
      }
    } catch (error) {
      console.log("Error deleting transaction::", error);
      await fetchAccountData();
    } finally {
      setisDeleteTransactionLoading(false);
      setIsDeleteTransactionDialongOpen(false);
    }
  };

  const handleTransactionSelection = (id: string) => {
    setTransactionForDeletion(id);
    setIsDeleteTransactionDialongOpen(true);
  };

  return (
    <div className="mx-auto pt-6 md:pt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <TransactionConfirmationDialog
        open={isDeleteTransactionDialongOpen}
        onClose={() => setIsDeleteTransactionDialongOpen(false)}
        isSubmitting={isDeleteTransactionLoading}
        handleSubmit={handleDelete}
      />
      <div className="grid gap-4">
        <h1 className="text-2xl font-bold mb-6">Account: {account.name}</h1>
        <AccountBalanceManager account={account} transactions={transactions} />
        <TransactionsTable
          setTransactionForDeletion={handleTransactionSelection}
          data={transactions}
        />
      </div>
    </div>
  );
}
