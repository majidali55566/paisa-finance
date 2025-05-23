import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import TransactionModel from "@/models/transaction";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
  const searchParams = req.nextUrl.searchParams;
  const timeframe = searchParams.get("timeframe");
  console.log(timeframe);
  try {
    const { startDate, endDate } = getDateRange(timeframe);
    console.log("startdate", startDate);
    console.log("endDate", endDate);
    console.log("accountId", accountId);
    const transactions = await TransactionModel.find({
      accountId,
      transactionDate: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    if (!transactions)
      return NextResponse.json(
        { message: "No transactions found" },
        { status: 400 }
      );

    return NextResponse.json({
      message: "Transactions fetched successfully",
      transactions,
      startDate,
      endDate,
    });
  } catch (error) {
    console.log("Error fetching chart data", error);
    return NextResponse.json(
      { message: "Internal server error " },
      { status: 500 }
    );
  }
}
function getDateRange(timeframe: string) {
  const endDate = new Date();
  const startDate = new Date();

  switch (timeframe) {
    case "7days":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "monthly":
      startDate.setMonth(endDate.getMonth() - 1);
      console.log(startDate);
      break;
    case "6months":
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case "yearly":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      // Fallback to 7 days
      startDate.setDate(endDate.getDate() - 7);
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}
