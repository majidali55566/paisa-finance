// src/lib/email-service.ts

import { sendFinancialReport } from "@/helpers/sendFinancialReportEmail";
import AccountModel from "@/models/Account";
import TransactionModel from "@/models/transaction";
import { IUser } from "@/models/User";
import mongoose from "mongoose";

interface ReportData {
  periodStart: Date;
  periodEnd: Date;
  income: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
  currentBalance: number;
}

export async function sendAccountReports(): Promise<void> {
  try {
    // Get all default accounts with populated user data
    const accounts = await AccountModel.find({ isDefault: true })
      .populate<{ userId: IUser }>({
        path: "userId",
        select: "email name",
      })
      .maxTimeMS(15000); // 15 second timeout

    for (const account of accounts) {
      if (!account.userId?.email) {
        console.warn(`No email found for account ${account.name}`);
        continue;
      }

      const reportData = await generateAccountReport(account._id);

      await sendFinancialReport({
        email: account.userId.email,
        accountName: account.name,
        ...reportData,
      });
    }
  } catch (error) {
    console.error("Failed to send account reports:", error);
    throw error;
  }
}

async function generateAccountReport(accountId: string): Promise<ReportData> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // Last 7 days

  const account = await AccountModel.findById(accountId).lean();
  if (!account) {
    throw new Error(`Account ${accountId} not found`);
  }

  const [income, expenses] = await Promise.all([
    TransactionModel.aggregate<{ _id: string; total: number }>([
      {
        $match: {
          accountId: new mongoose.Types.ObjectId(accountId),
          type: "income",
          date: { $gte: startDate },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
    TransactionModel.aggregate<{ _id: string; total: number }>([
      {
        $match: {
          accountId: new mongoose.Types.ObjectId(accountId),
          type: "expense",
          date: { $gte: startDate },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    periodStart: startDate,
    periodEnd: new Date(),
    income: income.map((i) => ({ category: i._id, amount: i.total })),
    expenses: expenses.map((e) => ({ category: e._id, amount: e.total })),
    currentBalance: account.balance,
  };
}
