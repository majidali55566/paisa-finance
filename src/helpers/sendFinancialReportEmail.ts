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
  aiInsights,
}: {
  email: string;
  accountName: string;
  periodStart: Date;
  periodEnd: Date;
  income: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
  currentBalance: number;
  aiInsights: string;
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
        aiInsights,
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
