import generateAiWeeklyReport from "@/helpers/generateAiWeeklyReport";
import { sendFinancialReport } from "@/helpers/sendFinancialReportEmail";
import AccountModel from "@/models/Account";
import TransactionModel from "@/models/transaction";
import UserModel from "@/models/User";

interface ReportData {
  periodStart: Date;
  periodEnd: Date;
  income: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
  currentBalance: number;
  aiInsights: string;
}

export async function sendAccountReports(): Promise<void> {
  try {
    const account = await AccountModel.findOne({ isDefault: true })
      .populate({
        path: "userId",
        model: UserModel,
        select: "email name",
      })
      .maxTimeMS(15000);

    if (!account) {
      console.warn(`No email found for account`);
      return;
    }

    const reportData = await generateAccountReport(account._id);

    await sendFinancialReport({
      email: account.userId.email,
      accountName: account.name,
      ...reportData,
    });
  } catch (error) {
    console.error("Failed to send account reports:", error);
    throw error;
  }
}

async function generateAccountReport(accountId: string): Promise<ReportData> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  startDate.setHours(0, 0, 0, 0); // Start of day

  const account = await AccountModel.findById(accountId).lean();
  if (!account) {
    throw new Error(`Account ${accountId} not found`);
  }

  const allTransactions = await TransactionModel.find({
    accountId,
    transactionDate: { $gte: startDate },
  }).lean();

  const aiInsights = await generateAiWeeklyReport(startDate, allTransactions);

  if (allTransactions.length > 0) {
    console.log("Sample transaction:", allTransactions[0]);
    console.log("Transaction types:", [
      ...new Set(allTransactions.map((t) => t.type)),
    ]);
  }

  const [income, expenses] = await Promise.all([
    TransactionModel.aggregate<{ _id: string; total: number }>([
      {
        $match: {
          accountId,
          type: "income",
          transactionDate: { $gte: startDate },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
    TransactionModel.aggregate<{ _id: string; total: number }>([
      {
        $match: {
          accountId,
          type: "expense",
          transactionDate: { $gte: startDate },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
  ]);

  console.log("Income aggregation result:", income);
  console.log("Expenses aggregation result:", expenses);

  return {
    periodStart: startDate,
    periodEnd: new Date(),
    income: income.map((i) => ({ category: i._id, amount: i.total })),
    expenses: expenses.map((e) => ({ category: e._id, amount: e.total })),
    currentBalance: account.balance,
    aiInsights,
  };
}
