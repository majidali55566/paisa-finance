import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import AccountModel from "@/models/Account";
import mongoose from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { accountId: string } }
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
    await AccountModel.updateMany(
      { userId: session.user._id },
      { $set: { isDefault: false } }
    );

    const updatedAccount = await AccountModel.findOneAndUpdate(
      { _id: accountId, userId: session.user._id },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!updatedAccount) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Default account set successfully",
        updatedAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error setting default account:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
