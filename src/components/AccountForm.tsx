import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  Account,
  AccountSchema,
  CreateAccount,
  CreateAccountSchema,
} from "@/schemas/AccountSchema";
import { AccountType } from "@/models/Account";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

interface AccountFormProps {
  onSubmit: (data: CreateAccount | Account) => Promise<void>;
  open: boolean;
  onOpenClose: (open: boolean) => void;
  isSubmitting: boolean;
  EditMode?: boolean;
  isDeleting?: boolean;
  hanldeDelete(): void;
  defaultValues?: Account;
}

const AccountForm = ({
  onSubmit,
  open,
  isSubmitting,
  onOpenClose,
  isDeleting = false,
  EditMode = false,
  defaultValues,
  hanldeDelete,
}: AccountFormProps) => {
  console.log(defaultValues);
  const schema = EditMode ? AccountSchema : CreateAccountSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      accountType: AccountType.SAVINGS,
      isDefault: false,
      balance: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
        balance: defaultValues.balance?.toString() || "",
      });
    }
  }, [defaultValues, form]);

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {EditMode ? "Edit an Account" : "Add New Account"}
            </DialogTitle>
            <DialogDescription>
              {EditMode
                ? "Update the details below"
                : "Enter the details below to create a new account."}
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Savings Account" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="balance"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="accountType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Account Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="isDefault"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Set as Default Account</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                {EditMode &&
                  (isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={hanldeDelete}
                      disabled={isSubmitting}
                    >
                      Delete
                    </Button>
                  ))}

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {EditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : EditMode ? (
                    "Update Account"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountForm;
