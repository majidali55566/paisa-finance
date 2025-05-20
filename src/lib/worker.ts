// src/worker.ts
import { Worker } from "bullmq";
import { redisConnection } from "@/lib/queue";
import TransactionModel from "@/models/transaction";
import mongoose from "mongoose";
import AccountModel from "@/models/Account";
import { dbConnect } from "./dbConnect";
import { loadEnv } from "./env";
import { sendAccountReports } from "./jobs/sendAccountReports";
loadEnv();

async function processJob(job: any) {
  await dbConnect();
  if (job.name === "process-recurring-transactions") {
    const now = new Date();

    console.log(`Processing at ${now.toISOString()}`);

    const transactions = await TransactionModel.find({
      isRecurring: true,
      nextRecurringDate: { $lte: now },
    }).lean();

    console.log(`Found ${transactions.length} transactions due for processing`);

    for (const tx of transactions) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const newTx = await TransactionModel.create(
          [
            {
              ...tx,
              _id: undefined,
              transactionDate: now,
              lastProcessed: now,
              nextRecurringDate: getNextRecurringDate(
                now,
                tx.recurringInterval!
              ),
              status: "completed",
            },
          ],
          { session }
        );

        const amount = tx.type === "income" ? tx.amount : -tx.amount;
        await AccountModel.findByIdAndUpdate(
          tx.accountId,
          { $inc: { balance: amount } },
          { session }
        );

        await TransactionModel.findByIdAndUpdate(
          tx._id,
          {
            lastProcessed: now,
            nextRecurringDate: getNextRecurringDate(now, tx.recurringInterval!),
          },
          { session }
        );

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        await TransactionModel.findByIdAndUpdate(tx._id, {
          status: "failed",
          lastProcessed: now,
        });
        throw error;
      } finally {
        session.endSession();
      }
    }
  } else if (job.name === "generate-weekly-reports") {
    await sendAccountReports();
  }
}

function getNextRecurringDate(date: Date, interval: string): Date {
  const nextDate = new Date(date);
  switch (interval) {
    case "daily":
      nextDate.setDate(date.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(date.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      nextDate.setFullYear(date.getFullYear() + 1);
      break;
  }
  return nextDate;
}

async function main() {
  const worker = new Worker("recurring-transactions", processJob, {
    connection: redisConnection,
    concurrency: 3,
  });

  await import("@/lib/shedular").then((m) => m.scheduleRecurringTransactions());

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });

  console.log("Worker started and waiting for jobs...");
}

main().catch(console.error);
