// src/emails/FinancialReportEmail.tsx
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Column,
} from "@react-email/components";

interface FinancialReportEmailProps {
  accountName: string;
  periodStart: Date;
  periodEnd: Date;
  income: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
  currentBalance: number;
}

export default function FinancialReportEmail({
  accountName,
  periodStart,
  periodEnd,
  income,
  expenses,
  currentBalance,
}: FinancialReportEmailProps) {
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>{accountName} Financial Report</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Your weekly financial report for {accountName} - Balance: $
        {currentBalance.toFixed(2)}
      </Preview>

      <Section style={main}>
        <Row>
          <Heading as="h2" style={heading}>
            {accountName} Financial Report
          </Heading>
        </Row>

        <Row>
          <Text style={periodText}>
            {periodStart.toDateString()} - {periodEnd.toDateString()}
          </Text>
        </Row>

        <Section style={section}>
          <Row>
            <Heading as="h3" style={sectionHeading}>
              Income
            </Heading>
          </Row>
          {income.map((item, index) => (
            <Row key={index}>
              <Column>{item.category}</Column>
              <Column style={amountColumn}>${item.amount.toFixed(2)}</Column>
            </Row>
          ))}
          <Row style={totalRow}>
            <Column>Total Income</Column>
            <Column style={amountColumn}>${totalIncome.toFixed(2)}</Column>
          </Row>
        </Section>

        <Section style={section}>
          <Row>
            <Heading as="h3" style={sectionHeading}>
              Expenses
            </Heading>
          </Row>
          {expenses.map((item, index) => (
            <Row key={index}>
              <Column>{item.category}</Column>
              <Column style={amountColumn}>${item.amount.toFixed(2)}</Column>
            </Row>
          ))}
          <Row style={totalRow}>
            <Column>Total Expenses</Column>
            <Column style={amountColumn}>${totalExpenses.toFixed(2)}</Column>
          </Row>
        </Section>

        <Section style={summarySection}>
          <Row>
            <Column style={balanceLabel}>Current Balance:</Column>
            <Column style={balanceAmount}>${currentBalance.toFixed(2)}</Column>
          </Row>
        </Section>

        <Row>
          <Text style={footerText}>
            This is an automated report. Please contact support if you have any
            questions.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Roboto, Verdana, sans-serif",
  padding: "20px",
  maxWidth: "600px",
  margin: "0 auto",
};

const heading = {
  color: "#333333",
  fontSize: "24px",
  marginBottom: "10px",
};

const periodText = {
  color: "#666666",
  fontSize: "14px",
  marginBottom: "20px",
};

const section = {
  margin: "20px 0",
  padding: "15px",
  backgroundColor: "#f9f9f9",
  borderRadius: "5px",
};

const sectionHeading = {
  color: "#444444",
  fontSize: "18px",
  marginBottom: "15px",
};

const amountColumn = {
  textAlign: "right" as const,
  width: "30%",
};

const totalRow = {
  fontWeight: "bold",
  borderTop: "1px solid #dddddd",
  paddingTop: "10px",
  marginTop: "10px",
};

const summarySection = {
  margin: "25px 0",
  padding: "15px",
  backgroundColor: "#f0f7ff",
  borderRadius: "5px",
};

const balanceLabel = {
  fontWeight: "bold",
  fontSize: "16px",
};

const balanceAmount = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "#2a6496",
  textAlign: "right" as const,
};

const footerText = {
  color: "#999999",
  fontSize: "12px",
  marginTop: "20px",
};
