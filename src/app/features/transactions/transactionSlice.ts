import { createSlice } from "@reduxjs/toolkit";
import { Transaction } from "@/schemas/TransactionSchema";
import { createTransaction, getAccountTransactions } from "./transactionsApi";

interface TransactionState {
  transactions: Transaction[];
  addTransactionStatus: "idle" | "loading" | "succeeded" | "failed";
  getAccountTransactionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  addTransactionStatus: "idle",
  getAccountTransactionStatus: "idle",
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      //create transaction
      .addCase(createTransaction.pending, (state) => {
        state.addTransactionStatus = "loading";
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.addTransactionStatus = "succeeded";
        state.transactions.push(action.payload);
        state.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.addTransactionStatus = "failed";
        state.error = action.payload as string;
      })
      //get account transactions
      .addCase(getAccountTransactions.pending, (state) => {
        state.getAccountTransactionStatus = "loading";
        state.error = null;
      })
      .addCase(getAccountTransactions.fulfilled, (state, action) => {
        state.getAccountTransactionStatus = "succeeded";
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(getAccountTransactions.rejected, (state, action) => {
        state.getAccountTransactionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
