import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./features/accounts/accountSlice";
import transactionReducer from "./features/transactions/transactionSlice";
export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
