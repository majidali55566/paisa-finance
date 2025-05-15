import { Transaction, CreateTransaction } from "@/schemas/TransactionSchema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Key } from "lucide-react";

export const createTransaction = createAsyncThunk<
  Transaction,
  CreateTransaction,
  { rejectValue: string }
>("transactions/add", async (transactionData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `/api/accounts/${transactionData.accountId}/transactions`,
      transactionData
    );
    return response.data.transaction as Transaction;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.date?.message || "Failed to create Transaction"
    );
  }
});

export const getAccountTransactions = createAsyncThunk<
  Transaction[],
  { accountId: string },
  { rejectValue: string }
>("transactions/account/get", async ({ accountId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/accounts/${accountId}/transactions`);
    return response.data.transactions as Transaction[];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.message || "Failed to fetch accounts recent transactions"
    );
  }
});
