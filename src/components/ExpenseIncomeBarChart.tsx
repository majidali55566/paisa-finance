"use client";

import { Loader2, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
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
import { Transaction } from "@/schemas/TransactionSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { formatDate } from "date-fns";

const chartConfig = {
  amount: {
    label: "amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type TransactionTypeFilter = "all" | "income" | "expense";

export default function IncomeExpenseBarChart({
  accountId,
}: {
  accountId: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndtDate] = useState<string | null>(null);

  const filteredTypeData = useMemo(() => {
    if (typeFilter === "all") return allTransactions;
    return allTransactions.filter((tsx) => tsx.type === typeFilter);
  }, [typeFilter, allTransactions]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/accounts/${accountId}/transactions/chart-data?timeframe=monthly`
        );
        if (response.status === 200) {
          const formattedTransactions = response.data.transactions.map(
            (tsx: Transaction) => ({
              ...tsx,
              transactionDate: new Date(tsx.transactionDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              ),
            })
          );
          setAllTransactions(formattedTransactions);
          console.log(response.data);
          setStartDate(formatDate(response.data.startDate, "dd-MMMM"));
          setEndtDate(formatDate(response.data.endDate, "dd-MMMM"));
        }
      } catch (error) {
        console.error("Error getting chart data transactions", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [accountId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm md:text-base">
            Monthly Transactions Chart
          </CardTitle>
          <div>
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as TransactionTypeFilter)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription>
          <div className="flex">
            <p>{startDate}</p>
            <p>{endDate}</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredTypeData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              width={800}
              height={300}
              data={filteredTypeData}
              accessibilityLayer
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="transactionDate"
                tickLine={false}
                tickMargin={10}
                minTickGap={32}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `${Number(value).toLocaleString("en-US", {
                        style: "currency",
                        currency: "PKR",
                      })}`,
                    ]}
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {filteredTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.type === "income" ? "#4CAF50" : "#F44336"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No transactions found for the selected filter
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing transactions for the this month
        </div>
      </CardFooter>
    </Card>
  );
}
