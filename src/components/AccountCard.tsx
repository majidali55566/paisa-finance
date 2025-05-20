import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, PiggyBank, Wallet } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Account } from "@/schemas/AccountSchema";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
const AccountCard = ({
  account,
  onToggleDefault,
  onHandleEdit,
}: {
  account: Account;
  changeDefault: string;
  onHandleEdit(account: Account): void;
  onToggleDefault: (accountId: string) => void;
}) => {
  const AccountIcon = account.accountType === "current" ? Wallet : PiggyBank;

  const router = useRouter();

  return (
    <Card
      key={account._id}
      className="min-w-[15rem] flex flex-wrap justify-between"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <AccountIcon color="gray" />
          <CardTitle className="text-xs">{account.name}</CardTitle>

          <Switch
            checked={account.isDefault}
            onCheckedChange={() => onToggleDefault(account._id)}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30"
          />
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="">
          <p className="text-lg font-bold">Rs. {account.balance}</p>
          <Badge variant="outline">{account.accountType}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <Button
          onClick={() => {
            router.push(`/dashboard/accounts/${account._id}`);
          }}
          className="text-xs"
        >
          View details
        </Button>
        <Edit onClick={() => onHandleEdit(account)} />
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
