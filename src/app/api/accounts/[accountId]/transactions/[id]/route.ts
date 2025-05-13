import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../../../auth/[...nextauth]/options";
import TransactionModel from "@/models/transaction";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const transactionId = params.id;

  if (!session || !session.user._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    return NextResponse.json(
      { message: "Invalid transaction ID" },
      { status: 400 }
    );
  }

  try {
    const transaction = await TransactionModel.findOne({
      _id: transactionId,
      userId: session.user._id,
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error) {
    console.log("Error getting transaction by id", error);

    return NextResponse.json(
      { message: "Error fetching transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const transactionId = params.id;

  if (!session || !session.user._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    return NextResponse.json(
      { message: "Invalid transaction ID" },
      { status: 400 }
    );
  }

  try {
    const {
      amount,
      type,
      description,
      transactionDate,
      category,
      receiptUrl,
      isRecurring,
      recurringInterval,
      nextRecurringDate,
      lastProcessed,
      status,
    } = await req.json();
    const updatedTransaction = await TransactionModel.findOneAndUpdate(
      { _id: transactionId, userId: session.user._id },
      {
        $set: {
          amount,
          type,
          description,
          transactionDate,
          category,
          receiptUrl,
          isRecurring,
          recurringInterval,
          nextRecurringDate,
          lastProcessed,
          status,
        },
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Updated successfully", updatedTransaction },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating transaction", error);
    return NextResponse.json(
      { message: "Error updating transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const transactionId = params.id;

  if (!session || !session.user._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    return NextResponse.json(
      { message: "Invalid transaction ID" },
      { status: 400 }
    );
  }

  try {
    const deletedTransaction = await TransactionModel.findOneAndDelete({
      _id: transactionId,
      userId: session.user._id,
    });

    if (!deletedTransaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transaction deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting transaction", error);

    return NextResponse.json(
      { message: "Error deleting transaction" },
      { status: 500 }
    );
  }
}
