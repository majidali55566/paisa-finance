import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import AccountModel from "@/models/Account";
import { CreateAccountSchema } from "@/schemas/AccountSchema";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, accountType, balance, isDefault } = parsed.data;
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingAccounts = await AccountModel.find({ userId: user._id });

    let shouldBeDefault = isDefault;

    if (existingAccounts.length === 0) {
      shouldBeDefault = true;
    }

    if (shouldBeDefault) {
      await AccountModel.updateMany(
        { userId: user._id, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const newAccount = new AccountModel({
      userId: user._id,
      name,
      accountType,
      balance: Number(balance),
      isDefault: shouldBeDefault,
    });

    const savedAccount = await newAccount.save();

    return NextResponse.json(
      {
        message: "Account created successfully",
        account: savedAccount,
        wasForcedDefault: existingAccounts.length === 0 && !isDefault,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating account", error);
    return NextResponse.json(
      {
        message: "Something went wrong while creating account",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const accounts = await AccountModel.find({ userId: session.user._id });
    if (accounts.length === 0) {
      return NextResponse.json(
        {
          message: "No accounts found Please create account first.",
          accounts,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Accounts fetched succesfully!", accounts },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error error getting account", error);

    return Response.json(
      {
        message: "Something went wrong while creating account",
      },
      { status: 500 }
    );
  }
}
