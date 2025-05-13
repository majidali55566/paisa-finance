import { createSlice } from "@reduxjs/toolkit";
import { Account } from "@/schemas/AccountSchema";
import {
  fetchAllAccounts,
  addAccount,
  changeDefaultAccount,
} from "./accountsapi";

interface AccountsState {
  accounts: Account[];
  defaultAccountId: string | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  addStatus: "idle" | "loading" | "succeeded" | "failed";
  changeDefault: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: AccountsState = {
  accounts: [],
  defaultAccountId: null,
  fetchStatus: "idle",
  addStatus: "idle",
  changeDefault: "idle",
  error: null,
};
const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch accounts
      .addCase(fetchAllAccounts.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAllAccounts.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.accounts = action.payload || [];
        const defaultAcc = action.payload.find((acc) => acc.isDefault);
        state.defaultAccountId = defaultAcc ? defaultAcc._id! : null;
      })
      .addCase(fetchAllAccounts.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload as string;
      })
      //add account
      .addCase(addAccount.pending, (state) => {
        state.addStatus = "loading";
        state.error = null;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        state.accounts.push(action.payload);
        if (action.payload.isDefault) {
          state.accounts.forEach((acc) => {
            acc.isDefault = acc._id === action.payload._id;
          });
          state.defaultAccountId = action.payload._id!;
        }
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.addStatus = "failed";
        state.error = action.payload as string;
      })
      //changeDefaultAccount
      .addCase(changeDefaultAccount.pending, (state) => {
        state.changeDefault = "loading";
        state.error = null;
      })
      .addCase(changeDefaultAccount.fulfilled, (state, action) => {
        state.changeDefault = "succeeded";
        state.accounts.forEach((acc) => {
          acc.isDefault = acc._id === action.payload;
        });
        state.defaultAccountId = action.payload;
      })
      .addCase(changeDefaultAccount.rejected, (state, action) => {
        state.changeDefault = "failed";
        state.error = action.payload as string;
      });
  },
});

export default accountSlice.reducer;
