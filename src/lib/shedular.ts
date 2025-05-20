// src/lib/scheduler.ts
import AccountModel from "@/models/Account";
import { transactionQueue } from "./queue";
import dbConnect from "./dbConnect";

export async function scheduleRecurringTransactions() {
  try {
    await dbConnect(); // Ensure DB connection

    // Clear existing jobs
    const jobs = await transactionQueue.getRepeatableJobs();
    await Promise.all(
      jobs.map((job) => transactionQueue.removeRepeatableByKey(job.key))
    );

    // Schedule daily transactions
    await transactionQueue.add(
      "process-recurring-transactions",
      {},
      {
        repeat: { pattern: "0 0 * * *" },
        jobId: "recurring-transactions-processor",
      }
    );

    // Schedule test reports (every 5 minutes)
    const accounts = await AccountModel.find({}).maxTimeMS(15000);

    for (const account of accounts) {
      await transactionQueue.add(
        "generate-weekly-reports",
        {
          accountId: account._id,
          isTestRun: true,
        },
        {
          repeat: { pattern: "*/5 * * * *" },
          jobId: `weekly-report-test-${account._id}`,
        }
      );
    }

    console.log(`Scheduled:
      - Daily transactions at midnight
      - Test reports every 5 minutes for ${accounts.length} accounts`);
  } catch (error) {
    console.error("Scheduling failed:", error);
    throw error;
  }
}
