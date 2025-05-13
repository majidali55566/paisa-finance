import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, password, username } = await request.json();
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified)
        return Response.json(
          {
            message: "User already registered with this email.Please login!",
            success: false,
          },
          { status: 409 }
        );
      else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        const expiryDate = new Date();
        //setting expiry code valid for 24 hours
        expiryDate.setHours(expiryDate.getHours() + 24);
        expiryDate.toISOString();
        existingUser.verifyCodeExpiry = expiryDate;
        await existingUser.save();

        // ✅ Send verification email to unverified users, already registered
        // const emailResponse = await sendVerificationEmail(
        //   email,
        //   username,
        //   verifyCode
        // );
        // if (!emailResponse.success) {
        //   return Response.json(
        //     {
        //       success: false,
        //       message: emailResponse.message,
        //     },
        //     { status: 500 }
        //   );
        // }
        return NextResponse.json(
          {
            success: true,
            message:
              "Unvarified email please verify your account.We have sent verification email",
          },
          { status: 200 }
        );
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      //setting expiry code valid for 24 hours
      expiryDate.setHours(expiryDate.getHours() + 24);
      expiryDate.toISOString();
      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCodeExpiry: expiryDate,
        verifyCode,
        isVerified: false,
      });
      await user.save();

      // ✅ Send verification email to unverified users that are first newly created
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);

    return Response.json(
      { message: "Something went wrong while signup!" },
      {
        status: 500,
      }
    );
  }
}
