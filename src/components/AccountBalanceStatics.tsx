import { Account } from "@/schemas/AccountSchema";
import { Badge } from "@/components/ui/badge";
import { Progress } from "./ui/progress";
import { Transaction } from "@/schemas/TransactionSchema";

interface AccountBalanceManagerProps {
  account: Account;
  transactions: Transaction[];
}

const AccountBalanceManager = ({
  account,
  transactions,
}: AccountBalanceManagerProps) => {
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = account ? Number(account.balance) : 0;

  const isNegativeBalance = balance < 0;
  const absoluteBalance = Math.abs(balance);

  const usagePercent = isNegativeBalance
    ? 100
    : balance > 0
      ? Math.min((totalExpenses / balance) * 100, 100)
      : 0;

  const progressColor = isNegativeBalance
    ? "bg-red-500"
    : usagePercent >= 80
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="border rounded-sm p-4">
      {account ? (
        <div>
          <div className="flex gap-2 max-w-6xl">
            <p className="font-semibold text-lg">{account.name}</p>
            <Badge variant="outline">{account.accountType}</Badge>
            {isNegativeBalance && (
              <Badge variant="destructive">Overdrawn</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-muted-foreground">
                Balance:{" "}
                <span className={isNegativeBalance ? "text-red-500" : ""}>
                  Rs. {balance.toFixed(2)}
                </span>
              </p>
              <p className="text-muted-foreground">
                Income: Rs. {totalIncome.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">
                Expenses: Rs. {totalExpenses.toFixed(2)}
              </p>
              {isNegativeBalance && (
                <p className="text-red-500 text-sm">
                  Warning: Negative balance
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 mb-1">
            <Progress value={usagePercent} className={progressColor} />
          </div>

          <p className="text-sm text-muted-foreground">
            {isNegativeBalance
              ? `You're overdrawn by Rs. ${absoluteBalance.toFixed(2)}`
              : usagePercent >= 100
                ? "You've used up your entire balance!"
                : `You've used ${usagePercent.toFixed(1)}% of your balance.`}
          </p>
        </div>
      ) : (
        <p>No account selected</p>
      )}
    </div>
  );
};

export default AccountBalanceManager;
