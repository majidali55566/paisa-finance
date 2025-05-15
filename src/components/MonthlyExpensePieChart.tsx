"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import { isThisMonth } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAppSelector } from "@/app/hooks";

const COLOR_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
];

const chartConfig = {} satisfies ChartConfig;

export function MonthlyExpensePieChart() {
  const { transactions } = useAppSelector((state) => state.transactions);

  // Filter only current month's expenses
  const monthlyExpenses = transactions.filter(
    (t) =>
      t.type === "expense" &&
      t.transactionDate &&
      isThisMonth(new Date(t.transactionDate))
  );

  // extract unique expense categories from current month
  const categorySet = new Set<string>();
  monthlyExpenses.forEach((t) => {
    categorySet.add(t.category || "uncategorized");
  });
  const expenseCategories = Array.from(categorySet);

  const categoryColorMap: Record<string, string> = {};
  expenseCategories
    .map((category, index) => ({
      category,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    }))
    .forEach(({ category, color }) => {
      categoryColorMap[category] = color;
    });

  const expenseMap = new Map<string, number>();
  monthlyExpenses.map((t) => {
    const category = t.category || "uncategorized";
    const current = expenseMap.get(category) || 0;
    expenseMap.set(category, current + Number(t.amount));
  });

  const expenseData = Object.fromEntries(expenseMap);

  const chartData = Object.keys(expenseData).map((category) => ({
    category,
    amount: expenseData[category],
    fill: categoryColorMap[category],
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>
          Distribution of your expenses for this month
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              outerRadius={100}
              dataKey="amount"
              label
              nameKey="category"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {monthlyExpenses.length === 0 ? (
            "No spending recorded this month"
          ) : (
            <>
              You're tracking {monthlyExpenses.length} monthly transactions
              <TrendingUp className="h-4 w-4 text-green-600" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {monthlyExpenses.length === 0
            ? "Add your first transaction to start tracking"
            : `Across ${expenseCategories.length} categories`}
        </div>
      </CardFooter>
    </Card>
  );
}
