"use client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTransaction,
  CreateTransactionSchema,
} from "@/schemas/TransactionSchema";
import {
  RecurringInterval,
  TransactionStatus,
  TransactionType,
} from "@/models/transaction";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { defaultCategories } from "@/lib/categories";
import { Switch } from "@/components/ui/switch";
import { createTransaction } from "@/app/features/transactions/transactionsApi";
import { toast } from "sonner";
import { AccountSelect } from "@/components/AccountSelect";
const AddTransactionPage = () => {
  const { accounts, defaultAccountId } = useAppSelector(
    (state) => state.accounts
  );
  const dispatch = useAppDispatch();
  const { addTransactionStatus } = useAppSelector(
    (state) => state.transactions
  );
  useEffect(() => {
    if (defaultAccountId) form.setValue("accountId", defaultAccountId);
  }, [defaultAccountId]);

  console.log(defaultAccountId);

  const form = useForm<CreateTransaction>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      accountId: accounts.length ? defaultAccountId || accounts[0]._id : "",
      amount: "",
      type: TransactionType.INCOME,
      description: "",
      transactionDate: new Date(),
      category: "",
      subcategory: "",
      receiptUrl: "",
      isRecurring: false,
      recurringInterval: RecurringInterval.WEEKLY,
      status: TransactionStatus.COMPLETED,
    },
  });

  const transactionType = useWatch({
    control: form.control,
    name: "type",
  });
  const selectedCategory = useWatch({
    control: form.control,
    name: "category",
  });

  console.log("selected category ", selectedCategory);

  const currentCategory = defaultCategories.find(
    (cat) => cat.id === selectedCategory
  );

  form.watch("isRecurring");

  const subcategories = currentCategory?.subcategories || [];
  useEffect(() => {
    form.setValue("subcategory", "");
  }, [currentCategory, transactionType]);

  const onAccountChange = (value: string) => {
    form.setValue("accountId", value);
  };

  console.log(form.getValues());

  const onSubmit = async (data: CreateTransaction) => {
    console.log(data);
    try {
      const result = await dispatch(createTransaction(data));

      if (createTransaction.fulfilled.match(result)) {
        toast.success("Transaction created successfully");
        form.reset();
      } else {
        toast.error(result.error?.message || "Transaction creation failed");
      }
    } catch (error) {
      console.log("Error add transactions", error);
      toast.error("Transaction creation failed");
    }
  };

  return (
    <div className="grid justify-center pt-[7rem]">
      <div className="md:w-40rem space-y-6">
        <h1 className="text-2xl font-bold">Add Transaction</h1>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="space-y-4 rounded-lg border p-4">
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TransactionType.EXPENSE}>
                            Expense
                          </SelectItem>
                          <SelectItem value={TransactionType.INCOME}>
                            Income
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TransactionStatus.PENDING}>
                            Pending
                          </SelectItem>
                          <SelectItem value={TransactionStatus.COMPLETED}>
                            Completed
                          </SelectItem>
                          <SelectItem value={TransactionStatus.FAILED}>
                            Failed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What's this for?"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h2 className="text-lg font-semibold">Categorization</h2>

              <div className="flex justify-between">
                <FormField
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {defaultCategories
                            .filter(
                              (ctg) =>
                                ctg.type === transactionType.toUpperCase()
                            )
                            .map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {subcategories.length > 0 && (
                  <FormField
                    name="subcategory"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {subcategories.map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h2 className="text-lg font-semibold">Timing & Account</h2>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="transactionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="accountId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <AccountSelect
                        accounts={accounts}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          onAccountChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <FormField
                name="isRecurring"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Recurring Transaction
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Enable for repeating transactions
                      </p>
                    </div>
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

              {form.getValues("isRecurring") && (
                <FormField
                  name="recurringInterval"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurring Interval</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={RecurringInterval.DAILY}>
                            Daily
                          </SelectItem>
                          <SelectItem value={RecurringInterval.WEEKLY}>
                            Weekly
                          </SelectItem>
                          <SelectItem value={RecurringInterval.MONTHLY}>
                            Monthly
                          </SelectItem>
                          <SelectItem value={RecurringInterval.YEARLY}>
                            Yearly
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            {addTransactionStatus === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Button type="submit" size="lg" className="w-full">
                Add Transaction
              </Button>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddTransactionPage;
