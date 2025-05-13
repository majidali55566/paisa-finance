"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account } from "@/schemas/AccountSchema";

interface AccountSelectProps {
  accounts: Account[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const AccountSelect = ({
  accounts,
  value,
  onValueChange,
  className,
}: AccountSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account._id} value={account._id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
