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

  const balance = account ? Number(account.balance) : 0;
  const usagePercent =
    balance > 0 ? Math.min((totalExpenses / balance) * 100, 100) : 0;

  return (
    <div className="border rounded-sm p-4">
      {account ? (
        <div>
          <div className="flex gap-2 max-w-6xl">
            <p className="font-semibold text-lg">{account.name}</p>
            <Badge variant="outline">{account.accountType}</Badge>
          </div>

          <div>
            <p className="text-muted-foreground">
              Balance: Rs. {balance.toFixed(2)}
            </p>
            <p className="text-muted-foreground">
              Expenses: Rs. {totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="mt-2 mb-1">
            <Progress value={usagePercent} />
          </div>

          <p className="text-sm text-muted-foreground">
            {usagePercent >= 100
              ? "You've used up your entire balance!"
              : `You've used ${usagePercent.toFixed(1)}% of your balance.`}
          </p>
        </div>
      ) : (
        <p>No default account selected</p>
      )}
    </div>
  );
};

export default AccountBalanceManager;
