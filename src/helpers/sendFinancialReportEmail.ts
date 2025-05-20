// src/lib/email.ts

import { resend } from "@/lib/resend";
import FinancialReportEmail from "../../emails/financialReportEmail";

export async function sendFinancialReport({
  email,
  accountName,
  expenses,
  income,
  periodEnd,
  periodStart,
  currentBalance,
}: {
  email: string;
  accountName: string;
  periodStart: Date;
  periodEnd: Date;
  income: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
  currentBalance: number;
}) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: `${accountName} Weekly Financial Report`,
      react: FinancialReportEmail({
        periodStart,
        periodEnd,
        income,
        accountName,
        expenses,
        currentBalance,
      }),
    });
    return { success: true, message: "Financial report sent successfully" };
  } catch (error) {
    console.log("Error sending financialReportEmail", error);
    return {
      success: false,
      message: "Failed to send financialReportEmail.",
    };
  }
}
