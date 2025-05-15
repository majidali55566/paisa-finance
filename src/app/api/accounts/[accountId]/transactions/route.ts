import TransactionModel from "@/models/transaction";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

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
      nextRecurringDate,
      lastProcessed,
      status,
    } = await req.json();

    if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
      return NextResponse.json(
        { message: "Invalid account ID" },
        { status: 400 }
      );
    }

    const newTransaction = new TransactionModel({
      userId: session.user._id,
      accountId,
      amount,
      type,
      description,
      transactionDate,
      category: category?.toLowerCase(),
      receiptUrl,
      isRecurring,
      recurringInterval,
      nextRecurringDate,
      lastProcessed,
      status,
    });

    await newTransaction.save();

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        transaction: newTransaction,
      },
      { status: 201 }
    );
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
    }).sort({ transactionDate: -1 });

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
