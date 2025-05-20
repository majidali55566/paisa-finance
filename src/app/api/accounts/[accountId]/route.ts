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

  const { accountId } = params;

  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return NextResponse.json(
      { message: "Invalid account ID" },
      { status: 400 }
    );
  }

  try {
    const { _id, name, accountType, balance, isDefault } = await req.json();
    console.log(_id, name, accountType);
    if (!name || !accountType || balance === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isDefault) {
      await AccountModel.updateMany(
        { userId: session.user._id, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const account = await AccountModel.findOneAndUpdate(
      {
        _id,
        userId: session.user._id,
      },
      {
        $set: { name, accountType, balance, isDefault },
      },
      { new: true }
    );

    if (!account) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Account updated successfully",
        account,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating account:", error);
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

  const authSession = await getServerSession(authOptions);
  if (!authSession?.user?._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const accountId = params.accountId;
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return NextResponse.json(
      { message: "Invalid account ID" },
      { status: 400 }
    );
  }

  const dbSession = await mongoose.startSession();

  try {
    await dbSession.startTransaction();

    const account = await AccountModel.findById(accountId)
      .session(dbSession)
      .lean();

    if (!account) {
      await dbSession.abortTransaction();
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    const wasDefault = account.isDefault;

    const [deletedAccount] = await Promise.all([
      AccountModel.findOneAndDelete(
        { _id: accountId, userId: authSession.user._id },
        { session: dbSession }
      ),
      TransactionModel.deleteMany({ accountId }).session(dbSession),
    ]);

    if (!deletedAccount) {
      await dbSession.abortTransaction();
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    let newDefaultAccountId = null;
    if (wasDefault) {
      const candidate = await AccountModel.findOne(
        { userId: authSession.user._id, _id: { $ne: accountId } },
        null,
        { session: dbSession, sort: { updatedAt: -1 } }
      );

      if (candidate) {
        await AccountModel.findByIdAndUpdate(
          candidate._id,
          { isDefault: true },
          { session: dbSession }
        );
        newDefaultAccountId = candidate._id;
      }
    }

    await dbSession.commitTransaction();

    return NextResponse.json(
      {
        message: "Account deleted successfully",
        deletedAccount,
        wasDefault,
        newDefaultAccountId,
      },
      { status: 200 }
    );
  } catch (error) {
    await dbSession.abortTransaction();
    console.error("Account deletion failed:", error);
    return NextResponse.json(
      { message: "Failed to delete account" },
      { status: 500 }
    );
  } finally {
    dbSession.endSession();
  }
}
