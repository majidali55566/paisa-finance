import dbConnect from "@/lib/dbConnect";
import AccountModel from "@/models/Account";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import TransactionModel from "@/models/transaction";

interface AccountParams {
  accountId: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: AccountParams }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { accountId } = params;
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return NextResponse.json(
      { message: "Invalid account ID" },
      { status: 400 }
    );
  }
  try {
    const account = await AccountModel.findOne({
      userId: session.user._id,
      _id: accountId,
    });
    if (!account) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Account fetched successfully", account },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching the account" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: AccountParams }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const accountId = params.id;
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return NextResponse.json(
      { message: "Invalid account ID" },
      { status: 400 }
    );
  }

  try {
    const { name, accountType, balance, isDefault } = await req.json();

    const account = await AccountModel.findOneAndUpdate(
      {
        _id: accountId,
        userId: session.user._id,
      },
      {
        $set: { name, accountType, balance, isDefault },
      },
      { new: true }
    );
    if (!account)
      return NextResponse.json(
        { message: "No account found" },
        { status: 404 }
      );

    return NextResponse.json(
      {
        message: "Updated succesfully!",
        updatedAccount: account,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error error updating account:", error);
    return NextResponse.json(
      { message: "Something went wrong while updating the account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: AccountParams }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const accountId = params.id;
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return NextResponse.json(
      { message: "Invalid account ID" },
      { status: 400 }
    );
  }

  try {
    const deletedAccount = await AccountModel.findOneAndDelete({
      _id: accountId,
      userId: session.user._id,
    });

    if (!deletedAccount) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    // Delete related transactions
    await TransactionModel.deleteMany({ accountId });

    return NextResponse.json(
      {
        message: "Account and related transactions deleted successfully",
        deletedAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account and transactions:", error);
    return NextResponse.json(
      { message: "Something went wrong during deletion" },
      { status: 500 }
    );
  }
}
