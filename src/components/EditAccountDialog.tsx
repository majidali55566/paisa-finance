import React, { useState } from "react";
import AccountForm from "./AccountForm";
import { Account, AccountSchema } from "@/schemas/AccountSchema";
import { toast } from "sonner";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  deleteAccount,
  updateAccountDetails,
} from "@/app/features/accounts/accountsapi";

interface EditAccountDialogProps {
  account: Account;
  isOpen: boolean;
  onOpenClose: () => void;
}

const EditAccountDialog = ({
  account,
  isOpen,
  onOpenClose,
}: EditAccountDialogProps) => {
  const dispatch = useAppDispatch();
  const { updateStatus, deleteStatus } = useAppSelector(
    (state) => state.accounts
  );

  const onSubmit = async (data: z.infer<typeof AccountSchema>) => {
    try {
      const result = await dispatch(updateAccountDetails(data));

      if (updateAccountDetails.fulfilled.match(result)) {
        toast.success("Account updated successfully!");
        onOpenClose(false);
      } else if (updateAccountDetails.rejected.match(result)) {
        toast.error(result.payload || "Failed to update account");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("An unexpected error occurred");
    }
  };
  const handleDeleteAccount = () => {
    try {
      const result = dispatch(deleteAccount(account._id));
      if (deleteAccount.fulfilled.match(result)) {
        toast.success("Account deleted successfully");
        onOpenClose();
      }
    } catch (error) {
      console.log("Error deleting an account", error);
      toast.error("Account couldn't be deleted");
    }
  };
  if (!account) return <h1>Loading...</h1>;

  return (
    <div>
      <AccountForm
        open={isOpen}
        onOpenClose={onOpenClose}
        onSubmit={onSubmit}
        isSubmitting={updateStatus === "loading"}
        defaultValues={account}
        isDeleting={deleteStatus === "loading"}
        EditMode={true}
        hanldeDelete={handleDeleteAccount}
      />
    </div>
  );
};

export default EditAccountDialog;
