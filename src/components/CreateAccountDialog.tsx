"use client";

import { useState } from "react";
import * as z from "zod";

import { CreateAccountSchema } from "@/schemas/AccountSchema";
import { addAccount } from "@/app/features/accounts/accountsapi";
import { useAppDispatch } from "@/app/hooks";
import { toast } from "sonner";
import AccountForm from "./AccountForm";
import { Card } from "./ui/card";
import { Plus } from "lucide-react";

export function CreateAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof CreateAccountSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(addAccount(data));

      if (addAccount.fulfilled.match(result)) {
        toast.success("Account created successfully!");
        handleClose();
      } else {
        toast.error(result.error?.message || "Failed to create account");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:bg-muted/50 transition-colors h-30 flex items-center justify-center p-6 border-dashed border-2 hover:border-solid hover:border-primary/20"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <p className="font-medium text-sm">Add New Account</p>
        </div>
      </Card>
      <AccountForm
        open={isOpen}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        onOpenClose={handleClose}
        hanldeDelete={() => console.log("handle delete")}
      />
    </div>
  );
}
