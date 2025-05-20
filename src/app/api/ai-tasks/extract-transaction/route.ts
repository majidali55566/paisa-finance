// app/api/ai-tasks/extract-transaction/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { defaultCategories } from "@/lib/categories";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // Convert File to Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
Analyze this financial document and extract the following details with high accuracy:

REQUIRED FIELDS (return as valid JSON):
{
  "amount": number,         // Total amount transacted (extract as number)
  "date": "YYYY-MM-DD",     // Transaction date in ISO format
  "description": "string",  // Contextual description (e.g. "Coffee at Starbucks")
  "category": "string",     // Best matching category from: ${defaultCategories.map((c) => c.name).join(", ")}
  "type": "expense|income"  // Determine based on context
}

SPECIAL CASES TO HANDLE:
1. For loans: 
   - If money is given: {type: "expense", category: "loan", description: "Loan to [recipient]"}
   - If money is received: {type: "income", category: "loan", description: "Loan from [sender]"}

2. For repayments:
   - {category: "repayment", type: "income" if receiving repayment}

3. For purchases:
   - Include merchant name and top 3 items in description
   - Categorize based on items (e.g. groceries, dining, etc.)

4. For bills:
   - Identify service provider (e.g. "Electricity bill - ConEd")

RULES:
- Always return valid JSON
- Never add explanatory text
- Use exact category names provided
- If uncertain about type, default to "expense"
- For dates, prefer the current date

EXAMPLE OUTPUTS:
1. Receipt for $12.50 at Starbucks:
   {
     "amount": 12.50,
     "date": "20-05-2024",
     "description": "Coffee at Starbucks",
     "category": "food",
     "type": "expense"
   }

2. Loan given to friend:
   {
     "amount": 1200,
     "date": "2024-05-15",
     "description": "Loan to John Doe",
     "category": "loan",
     "type": "expense"
   }

3. Grocery receipt:
   {
     "amount": 85.30,
     "date": "2024-05-18",
     "description": "Groceries at Whole Foods (milk, eggs, bread)",
     "category": "groceries",
     "type": "expense"
   }

Now analyze the provided document and return ONLY the JSON object with the extracted data.
`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = result.response;
    const text = response.text();

    const jsonString = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonString);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error processing receipt:", error);
    return NextResponse.json(
      { error: "Failed to process receipt" },
      { status: 500 }
    );
  }
}
