import { Account, CreateAccount } from "@/schemas/AccountSchema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllAccounts = createAsyncThunk<
  Account[],
  void,
  { rejectValue: string }
>("accounts/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/accounts");

    if (!Array.isArray(response.data.accounts)) {
      return thunkAPI.rejectWithValue("Invalid response format");
    }
    console.log(response.data.accounts);

    return response.data.accounts;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch accounts"
    );
  }
});

export const addAccount = createAsyncThunk<
  Account, // Return type on success
  CreateAccount, // Argument type passed to the thunk
  { rejectValue: string } // Rejected error type
>("accounts/add", async (accountData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/accounts", accountData);
    return response.data.account as Account;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add account"
    );
  }
});

export const changeDefaultAccount = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
  }
>("changeDefaultAccount", async (accountId, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/api/accounts/${accountId}/default`);
    return response.data.updatedAccount._id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to setDefault account"
    );
  }
});

export const updateAccountDetails = createAsyncThunk<
  Account,
  Account,
  { rejectValue: string }
>("accounts/updateAccountDetails", async (account, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/accounts/${account._id}`, account);
    return response.data.account;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update account"
    );
  }
});

export const deleteAccount = createAsyncThunk<
  {
    deletedAccountId: string;
    wasDefault: boolean;
    newDefaultAccountId: string | null;
  },
  string,
  { rejectValue: string }
>("accounts/delete", async (accountId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/accounts/${accountId}`);
    return {
      deletedAccountId: accountId,
      wasDefault: response.data.wasDefault,
      newDefaultAccountId: response.data.newDefaultAccountId || null,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete account"
    );
  }
});
