import { ITransaction } from "@/models/transaction";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAiWeeklyReport = async (
  startDate: Date,
  transactions: ITransaction[]
): Promise<string> => {
  if (transactions.length === 0) {
    return "No transactions found for this reporting period.";
  }

  const periodEnd = new Date();
  const prompt = `
**Objective:** 
Generate a concise analytical financial report focusing on recurring transactions and key observations for the period ${startDate.toDateString()} to ${periodEnd.toDateString()}.

**Data Processing Instructions:**
1. Calculate totals only for context, not as primary output
2. Focus on identifying and analyzing patterns
3. Extract recurring transactions with their details
4. Provide actionable insights

**Required Analysis:**
1. Recurring Transactions Analysis:
   - List all recurring transactions with:
     * Description
     * Amount
     * Category/Subcategory
     * Interval
     * Next due date
   - Calculate total recurring expenses
   - Flag any unusually high recurring payments

2. Key Financial Observations:
   - Spending patterns by category
   - Unusual or outlier transactions
   - Income consistency analysis
   - Savings rate assessment
   - Budget adherence evaluation

3. Recommendations:
   - Potential cost-saving opportunities
   - Recurring expense optimization
   - Budget adjustment suggestions

**Transaction Data (JSON Array):**
\`\`\`json
${JSON.stringify(
  transactions.map((t) => ({
    description: t.description,
    amount: t.amount,
    category: t.category,
    subcategory: t.subcategory,
    isRecurring: t.isRecurring,
    interval: t.recurringInterval,
    nextDueDate: t.nextRecurringDate,
    date: t.transactionDate,
    type: t.type,
  })),
  null,
  2
)}
\`\`\`

**Output Format:**

<strong>Weekly Financial Analysis</strong>
<strong>Period:</strong> ${startDate.toDateString()} - ${periodEnd.toDateString()}

<strong>Recurring Transactions:</strong>
• [Description]: [Amount] ([Category/Subcategory])
  - Interval: [Interval]
  - Next Due: [Next Due Date]
  
<strong>Key Observations:</strong>
• [Observation 1]
• [Observation 2]
• [Observation 3]

<strong>Recommendations:</strong>
• [Recommendation 1]
• [Recommendation 2]

**Additional Guidelines:**
- Keep the report concise (under 300 words)
- Use bullet points for readability
- Highlight any financial risks
- Suggest specific actions
- Maintain professional tone
`;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text.trim()) {
      return "Financial insights unavailable. Please review your transactions manually.";
    }

    return text;
  } catch (error) {
    console.error("Error generating AI financial report:", error);
    return "Unable to generate analysis at this time. Please try again later.";
  }
};

export default generateAiWeeklyReport;
