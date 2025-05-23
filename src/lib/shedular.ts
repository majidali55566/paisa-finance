import AccountModel from "@/models/Account";
import { transactionQueue } from "./queue";
import dbConnect from "./dbConnect";

export async function scheduleRecurringTransactions() {
  try {
    await dbConnect();

    const jobs = await transactionQueue.getRepeatableJobs();
    await Promise.all(
      jobs.map((job) => transactionQueue.removeRepeatableByKey(job.key))
    );

    await transactionQueue.add(
      "process-recurring-transactions",
      {},
      {
        repeat: { pattern: "0 0 * * *" },
        jobId: "recurring-transactions-processor",
      }
    );

    const account = await AccountModel.findOne({
      isDefault: true,
    }).maxTimeMS(15000);

    if (!account) {
      throw new Error("No default account found");
    }

    await transactionQueue.add(
      "generate-weekly-reports",
      {
        accountId: account._id,
      },
      {
        repeat: { pattern: "0 0 * * 0" }, // Runs at midnight every Sunday
        jobId: `weekly-report-${account._id}`,
      }
    );

    console.log(`Scheduled:
      - Daily transactions at midnight
      - Weekly reports every Sunday for account ${account._id}`);
  } catch (error) {
    console.error("Scheduling failed:", error);
    throw error;
  }
}
