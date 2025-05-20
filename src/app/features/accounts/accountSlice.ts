import { createSlice } from "@reduxjs/toolkit";
import { Account } from "@/schemas/AccountSchema";
import {
  fetchAllAccounts,
  addAccount,
  changeDefaultAccount,
  updateAccountDetails,
  deleteAccount,
} from "./accountsapi";

interface AccountsState {
  accounts: Account[];
  defaultAccountId: string | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  addStatus: "idle" | "loading" | "succeeded" | "failed";
  changeDefault: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: AccountsState = {
  accounts: [],
  defaultAccountId: null,
  fetchStatus: "idle",
  addStatus: "idle",
  changeDefault: "idle",
  deleteStatus: "idle",
  updateStatus: "idle",
  error: null,
};
const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    clearAccountError: (state) => {
      state.error = null;
      state.updateStatus = "idle";
    },
  },
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
      })
      //Update account
      .addCase(updateAccountDetails.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateAccountDetails.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.accounts = state.accounts.map((account) =>
          account._id === action.payload._id ? action.payload : account
        );

        if (action.payload.isDefault) {
          state.defaultAccountId = action.payload._id!;
          state.accounts.forEach((acc) => {
            acc.isDefault = acc._id === action.payload._id;
          });
        }
      })
      .addCase(updateAccountDetails.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload as string;
      })
      //delete an account
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        // Remove deleted account
        state.accounts = state.accounts.filter(
          (acc) => acc._id !== action.payload.deletedAccountId
        );

        // Handle default account case
        if (action.payload.wasDefault) {
          state.defaultAccountId = action.payload.newDefaultAccountId;

          // Update the new default account's status if it exists
          if (action.payload.newDefaultAccountId) {
            state.accounts = state.accounts.map((acc) => ({
              ...acc,
              isDefault: acc._id === action.payload.newDefaultAccountId,
            }));
          }
        }
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || "Failed to delete account";
      });
  },
});
export const { clearAccountError } = accountSlice.actions;
export default accountSlice.reducer;
