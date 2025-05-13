import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { decodedEmail, code } = await request.json();

    console.log(decodedEmail, code);

    if (!decodedEmail || !code) {
      return NextResponse.json(
        { message: "Email and code are required." },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email: decodedEmail });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please sign up!" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "User is already verified." },
        { status: 409 }
      );
    }

    if (user.verifyCode !== code) {
      return NextResponse.json(
        { message: "Invalid verification code." },
        { status: 400 }
      );
    }

    if (!user.verifyCodeExpiry || user.verifyCodeExpiry < new Date()) {
      return NextResponse.json(
        { message: "Verification code has expired." },
        { status: 400 }
      );
    }

    // ✅ If valid, update the user
    user.isVerified = true;
    user.verifyCode = null;
    user.verifyCodeExpiry = null;
    await user.save({ validateBeforeSave: false });

    return NextResponse.json(
      { message: "Email verified successfully!", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Something went wrong while verifying OTP." },
      { status: 500 }
    );
  }
}
