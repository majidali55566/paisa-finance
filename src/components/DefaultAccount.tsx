import { useAppSelector } from "@/app/hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const DefaultAccount = () => {
  const { accounts, defaultAccountId } = useAppSelector(
    (state) => state.accounts
  );

  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(
    defaultAccountId || undefined
  );

  useEffect(() => {
    if (defaultAccountId) setSelectedAccount(defaultAccountId);
  }, [defaultAccountId]);
  const onDefaultAccountChange = (value: string) => {
    setSelectedAccount(value);
  };
  return (
    <div>
      <Select value={selectedAccount} onValueChange={onDefaultAccountChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select account" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {accounts.map((account) => (
              <SelectItem key={account._id} value={account._id!}>
                {account.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DefaultAccount;
