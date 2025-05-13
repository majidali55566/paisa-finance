import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { AccountSelect } from "./AccountSelect";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { getAccountTransactions } from "@/app/features/transactions/transactionsApi";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const accountIdSchema = z.object({
  accountId: z.string({ required_error: "Account selection is required" }),
});

type AccountIdFormValues = z.infer<typeof accountIdSchema>;

const RecentTransactions = () => {
  const { accounts, defaultAccountId, fetchStatus } = useAppSelector(
    (state) => state.accounts
  );
  const { transactions } = useAppSelector((state) => state.transactions);
  const dispatch = useAppDispatch();

  const form = useForm<AccountIdFormValues>({
    resolver: zodResolver(accountIdSchema),
    defaultValues: {
      accountId: defaultAccountId || "",
    },
  });

  const selectedAccountId = form.watch("accountId");

  const memoizedAccounts = useMemo(() => accounts, [accounts]);

  // useEffect(() => {
  //   if (defaultAccountId) {
  //     form.setValue("accountId", selectedAccountId);
  //     fetchTransactions(defaultAccountId);
  //   }
  // }, [defaultAccountId]);

  // useEffect(() => {
  //   if (selectedAccountId) {
  //     form.setValue("accountId", selectedAccountId);
  //     fetchTransactions(selectedAccountId);
  //   }
  // }, [selectedAccountId]);

  useEffect(() => {
    const accountId = selectedAccountId || defaultAccountId;
    if (accountId) {
      fetchTransactions(accountId);
    }
  }, [selectedAccountId, defaultAccountId]);

  const fetchTransactions = async (accountId: string) => {
    try {
      const result = await dispatch(getAccountTransactions(accountId));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div className="space-y-4">
      <FormProvider {...form}>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <AccountSelect
            accounts={memoizedAccounts}
            value={form.getValues("accountId")}
            onValueChange={(value) => form.setValue("accountId", value)}
            className="min-w-[200px]"
          />
        </div>

        {transactions.map((transaction) => (
          <div key={transaction._id} className="">
            <div className="flex justify-between items-center">
              <div>
                <p className=" max-w-[10rem] md:max-w-[15rem] truncate">
                  {transaction.description || "No description"}
                </p>
                <p className="text-sm text-gray-500">
                  {format(transaction.transactionDate!, "dd MMMM yyyy, h:mm a")}
                </p>
              </div>
              <div className="flex items-end flex-col">
                <p
                  className={`font-medium flex items-center ${
                    transaction.type === "expense"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {transaction.type === "expense" ? (
                    <ArrowDownRight className="text-red-500" size={16} />
                  ) : (
                    <ArrowUpRight className="text-green-500" size={16} />
                  )}
                  {transaction.amount}
                </p>
                <p className="text-xs">
                  {transaction.isRecurring && "Recurring-"}
                  {transaction.isRecurring && transaction.recurringInterval}
                </p>
              </div>
            </div>
          </div>
        ))}
      </FormProvider>
    </div>
  );
};

export default RecentTransactions;
