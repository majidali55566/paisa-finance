import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification code by Paisa sumbhalo",
      react: VerificationEmail({ username, otp: verificationCode }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.log("Error sending verificationCode", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
