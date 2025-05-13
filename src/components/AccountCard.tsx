import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Account } from "@/schemas/AccountSchema";
const AccountCard = ({
  account,
  onToggleDefault,
}: {
  account: Account;
  changeDefault: string;
  onToggleDefault: (accountId: string) => void;
}) => {
  return (
    <Card key={account._id} className="w-[250px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs">{account.name}</CardTitle>

          <Switch
            checked={account.isDefault}
            onCheckedChange={() => onToggleDefault(account._id)}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30"
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-bold">Rs. {account.balance}</p>
        <p className="text-[12px] text-muted-foreground">
          {account.accountType}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <ArrowUpRight className="text-green-500" size={16} />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowDownRight className="text-red-500" size={16} />
          <span>Expense</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
