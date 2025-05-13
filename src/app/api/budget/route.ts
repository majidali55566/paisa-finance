import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import BudgetModel from "@/models/budget";

// GET: Get current user's budget
export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const budget = await BudgetModel.findOne({ userId: session.user._id });

    if (!budget) {
      return NextResponse.json({ message: "No budget set" }, { status: 404 });
    }

    return NextResponse.json({ budget }, { status: 200 });
  } catch (error) {
    console.log("Error getting budget with userId", error);
    return NextResponse.json(
      { message: "Error fetching budget" },
      { status: 500 }
    );
  }
}

// POST: Create or update user's budget
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    const updatedBudget = await BudgetModel.findOneAndUpdate(
      { userId: session.user._id },
      { $set: { amount } },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      {
        message: "Budget saved successfully",
        budget: updatedBudget,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error saving budget with userId", error);

    return NextResponse.json(
      { message: "Error saving budget" },
      { status: 500 }
    );
  }
}
