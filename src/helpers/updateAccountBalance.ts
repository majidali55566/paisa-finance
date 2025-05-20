import AccountModel from "@/models/Account";
import mongoose from "mongoose";

export default async function updateAccountBalance(
  accountId: string,
  amount: number,
  type: "income" | "expense",
  session?: mongoose.ClientSession
) {
  const amountToUpdate = type === "income" ? amount : -amount;

  return AccountModel.findByIdAndUpdate(
    accountId,
    { $inc: { balance: amountToUpdate } },
    { session, new: true }
  );
}
