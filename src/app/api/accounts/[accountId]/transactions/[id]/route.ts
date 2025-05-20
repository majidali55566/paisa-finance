import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../../../auth/[...nextauth]/options";
import TransactionModel from "@/models/transaction";
import AccountModel from "@/models/Account";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const transactionId = params.id;

  console.log(transactionId);

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
    const body = await req.json();
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
      subcategory,
      lastProcessed,
      status,
    } = body;

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      const existingTransaction = await TransactionModel.findOne({
        _id: transactionId,
        userId: session.user._id,
      }).session(dbSession);

      if (!existingTransaction) {
        await dbSession.abortTransaction();
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 404 }
        );
      }

      if (existingTransaction.status === "completed") {
        await AccountModel.findByIdAndUpdate(
          existingTransaction.accountId,
          {
            $inc: {
              balance:
                existingTransaction.type === "income"
                  ? -existingTransaction.amount
                  : existingTransaction.amount,
            },
          },
          { session: dbSession }
        );
      }

      const updateData: any = {
        amount,
        type,
        description,
        transactionDate,
        category,
        receiptUrl,
        isRecurring,
        nextRecurringDate,
        lastProcessed,
        subcategory,
        status,
      };

      if (!isRecurring) {
        updateData.recurringInterval = null;
      } else {
        updateData.recurringInterval = recurringInterval;
      }

      const updatedTransaction = await TransactionModel.findOneAndUpdate(
        { _id: transactionId, userId: session.user._id },
        { $set: updateData },
        { new: true, session: dbSession }
      );

      if (status === "completed") {
        await AccountModel.findByIdAndUpdate(
          updatedTransaction!.accountId,
          {
            $inc: {
              balance: type === "income" ? amount : -amount,
            },
          },
          { session: dbSession }
        );
      }

      await dbSession.commitTransaction();

      return NextResponse.json(
        { message: "Updated successfully", updatedTransaction },
        { status: 200 }
      );
    } catch (error) {
      await dbSession.abortTransaction();
      throw error;
    } finally {
      dbSession.endSession();
    }
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
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      const transactionToDelete = await TransactionModel.findOne({
        _id: transactionId,
        userId: session.user._id,
      }).session(dbSession);

      if (!transactionToDelete) {
        await dbSession.abortTransaction();
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 404 }
        );
      }

      if (transactionToDelete.status === "completed") {
        await AccountModel.findByIdAndUpdate(
          transactionToDelete.accountId,
          {
            $inc: {
              balance:
                transactionToDelete.type === "income"
                  ? -transactionToDelete.amount
                  : transactionToDelete.amount,
            },
          },
          { session: dbSession }
        );
      }

      const deletedTransaction = await TransactionModel.findOneAndDelete(
        {
          _id: transactionId,
          userId: session.user._id,
        },
        { session: dbSession }
      );

      await dbSession.commitTransaction();

      return NextResponse.json(
        {
          message: "Transaction deleted successfully",
          transaction: deletedTransaction,
        },
        { status: 200 }
      );
    } catch (error) {
      await dbSession.abortTransaction();
      throw error;
    } finally {
      dbSession.endSession();
    }
  } catch (error) {
    console.log("Error deleting transaction", error);
    return NextResponse.json(
      { message: "Error deleting transaction" },
      { status: 500 }
    );
  }
}
