import TransactionModel, { RecurringInterval } from "@/models/transaction";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import updateAccountBalance from "@/helpers/updateAccountBalance";
export async function POST(
  req: NextRequest,
  { params }: { params: { accountId: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?._id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { accountId } = params;

  try {
    const {
      amount,
      type,
      description,
      transactionDate,
      category,
      receiptUrl,
      isRecurring = false,
      recurringInterval,
      lastProcessed,
      subcategory,
      status = "completed",
    } = await req.json();

    console.log("transactionDate", transactionDate);

    if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
      return NextResponse.json(
        { message: "Invalid account ID" },
        { status: 400 }
      );
    }

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      let nextRecurringDate: Date | undefined = undefined;

      if (isRecurring && recurringInterval) {
        const baseDate = transactionDate
          ? new Date(transactionDate)
          : new Date();
        if (recurringInterval === RecurringInterval.DAILY) {
          nextRecurringDate = addDays(baseDate, 1);
        } else if (recurringInterval === RecurringInterval.WEEKLY) {
          nextRecurringDate = addWeeks(baseDate, 1);
        } else if (recurringInterval === RecurringInterval.MONTHLY) {
          nextRecurringDate = addMonths(baseDate, 1);
        } else if (recurringInterval === RecurringInterval.YEARLY) {
          nextRecurringDate = addYears(baseDate, 1);
        }
      }

      const newTransaction = await TransactionModel.create(
        [
          {
            userId: session.user._id,
            accountId,
            amount,
            type,
            description,
            transactionDate: transactionDate || new Date(),
            category: category?.toLowerCase(),
            receiptUrl,
            subcategory: subcategory ? subcategory.toLowerCase() : undefined,
            isRecurring,
            recurringInterval: isRecurring ? recurringInterval : undefined,
            nextRecurringDate,
            lastProcessed,
            status,
          },
        ],
        { session: dbSession }
      );

      if (status === "completed") {
        await updateAccountBalance(accountId, amount, type, dbSession);
      }

      await dbSession.commitTransaction();

      return NextResponse.json(
        {
          message: "Transaction created successfully",
          transaction: newTransaction[0],
        },
        { status: 201 }
      );
    } catch (error) {
      await dbSession.abortTransaction();
      throw error;
    } finally {
      dbSession.endSession();
    }
  } catch (err) {
    console.error("Transaction creation error:", err);
    return NextResponse.json(
      { message: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { accountId: string };
  }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { accountId } = params;

  if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
    return NextResponse.json(
      { message: "Invalid or missing accountId" },
      { status: 400 }
    );
  }

  try {
    const transactions = await TransactionModel.find({
      userId: session.user._id,
      accountId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Transactions fetched successfully", transactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting transactions:", error);
    return NextResponse.json(
      { message: "Failed to get transactions" },
      { status: 500 }
    );
  }
}
