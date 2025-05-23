import { useAppSelector } from "@/app/hooks";
import { AccountSelect } from "./AccountSelect";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Transaction } from "../schemas/TransactionSchema";
import { Badge } from "./ui/badge";

const accountIdSchema = z.object({
  accountId: z.string({ required_error: "Account selection is required" }),
});

type AccountIdFormValues = z.infer<typeof accountIdSchema>;

const RecentTransactions = () => {
  const { accounts, defaultAccountId } = useAppSelector(
    (state) => state.accounts
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AccountIdFormValues>({
    resolver: zodResolver(accountIdSchema),
    defaultValues: {
      accountId: defaultAccountId || "",
    },
  });

  const selectedAccountId = form.watch("accountId");

  useEffect(() => {
    const getAccountTransactions = async () => {
      setIsSubmitting(true);
      try {
        const accountId = selectedAccountId || defaultAccountId;
        if (accountId) {
          const response = await axios.get(
            `/api/accounts/${accountId}/transactions`
          );
          console.log(response.data);
          if (response.status === 200)
            setTransactions(response.data.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    getAccountTransactions();
  }, [selectedAccountId, defaultAccountId]);

  return (
    <div className="space-y-4">
      <FormProvider {...form}>
        <div className="flex items-center gap-4">
          <h2 className="font-semibold">Recent Transactions</h2>
          <AccountSelect
            accounts={accounts}
            value={form.getValues("accountId")}
            onValueChange={(value) => form.setValue("accountId", value)}
            className="min-w-[200px]"
          />
        </div>

        {isSubmitting ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions found.</p>
        ) : (
          transactions.slice(0, 6).map((transaction) => (
            <div
              key={transaction._id}
              className="border-b border-gray-200 pb-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm max-w-[10rem] md:max-w-[15rem] truncate">
                    {transaction.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(
                      transaction.transactionDate!,
                      "dd MMMM yyyy, h:mm a"
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p
                    className={cn(
                      "font-medium flex items-center",
                      transaction.type === "expense"
                        ? "clr-expense"
                        : "clr-income"
                    )}
                  >
                    {transaction.type === "expense" ? (
                      <ArrowDownRight size={16} className="mr-1" />
                    ) : (
                      <ArrowUpRight size={16} className="mr-1" />
                    )}
                    {transaction.amount}
                  </p>
                  {transaction.isRecurring && (
                    <Badge variant="outline">
                      <Clock />
                      {transaction.recurringInterval}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </FormProvider>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <ArrowUpRight className="clr-income" size={16} />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowDownRight className="clr-expense" size={16} />
          <span>Expense</span>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
