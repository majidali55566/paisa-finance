import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2, UploadIcon } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
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
import { defaultCategories } from "@/lib/categories";
import {
  CreateTransaction,
  CreateTransactionSchema,
  Transaction,
} from "@/schemas/TransactionSchema";
import {
  RecurringInterval,
  TransactionStatus,
  TransactionType,
} from "@/models/transaction";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { AccountSelect } from "./AccountSelect";
import { Switch } from "./ui/switch";
import { Account } from "@/schemas/AccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
interface TransactionFormProps {
  defaultValues?: Transaction;
  onSubmit: (data: CreateTransaction) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
  accounts: Account[];
  defaultAccountId?: string;
}
const TransactionForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitButtonText = "Submit",
  accounts,
  defaultAccountId,
}: TransactionFormProps) => {
  const [isProcessingImage, setIsProcessingImage] = useState(false);

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
      status: TransactionStatus.COMPLETED,
      ...defaultValues,
    },
  });

  const transactionType = useWatch({ control: form.control, name: "type" });
  const selectedCategory = useWatch({
    control: form.control,
    name: "category",
  });
  const isRecurring = useWatch({ control: form.control, name: "isRecurring" });
  form.watch("subcategory");
  const currentCategory = defaultCategories.find(
    (cat) => cat.id === selectedCategory
  );
  const subcategories = currentCategory?.subcategories || [];

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (files) => {
      if (files[0]) await processReceiptImage(files[0]);
    },
  });

  const processReceiptImage = async (file: File) => {
    setIsProcessingImage(true);
    form.clearErrors("root");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ai-tasks/extract-transaction", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        toast.error("Failed to process image");
      }

      if (response.status === 200) {
        toast.success("receipt scanned successfully");
        const { amount, date, description, type, category } =
          await response.json();
        console.log("Raw API response:", {
          amount,
          date,
          description,
          type,
          category,
        });

        const parsedDate = date ? parseISO(date) : new Date();
        console.log("Parsed date:", format(parsedDate, "yyyy-MM-dd"));

        // Update form values
        form.setValue("amount", amount ? String(amount) : "");
        form.setValue("description", description || "");
        form.setValue("transactionDate", parsedDate);

        if (type) {
          form.setValue("type", type);
        }
        console.log(type);

        // Handle category matching
        if (category) {
          const normalizedCategory = category.toLowerCase().trim();
          const matchedCategory = defaultCategories.find(
            (c) =>
              c.name.toLowerCase() === normalizedCategory &&
              c.type === form.getValues("type").toUpperCase()
          );

          if (matchedCategory) {
            form.setValue("category", matchedCategory.id);
          } else {
            console.warn(`No matching category found for: ${category}`);
          }
        }
      }
    } catch (error) {
      console.error("Processing error:", error);
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Receipt processing failed",
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  useEffect(() => {
    if (!isRecurring) {
      form.setValue("recurringInterval", undefined);
    }
  }, [isRecurring, form]);

  useEffect(() => {
    if (defaultAccountId) form.setValue("accountId", defaultAccountId);
  }, [defaultAccountId, form]);

  useEffect(() => {
    if (form.getValues("category") !== selectedCategory) {
      form.setValue("subcategory", "");
    }
  }, [selectedCategory, form]);

  return (
    <div className="grid justify-center">
      <div className="md:w-40rem space-y-6">
        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/10 relative overflow-hidden"
        >
          <input {...getInputProps()} />
          {isProcessingImage ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative h-24 w-24">
                {["#3B82F6", "#8B5CF6", "#EC4899"].map((color, i) => (
                  <div
                    key={i}
                    className="absolute h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: color,
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateX(30px) rotate(-${i * 120}deg)`,
                      animation: `orbit 3s linear infinite ${i * 0.5}s`,
                      filter: "drop-shadow(0 0 4px rgba(255,255,255,0.7))",
                    }}
                  />
                ))}
                <div className="absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-sm font-medium">Processing receipt...</span>
            </div>
          ) : (
            <>
              <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2">Drag & drop a receipt, or click to select</p>
              <p className="text-sm text-muted-foreground">
                AI automatically extract transaction details
              </p>

              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => {
                  const size = Math.random() * 6 + 4;
                  const duration = Math.random() * 15 + 10;
                  const delay = Math.random() * 5;
                  const colors = [
                    "#60A5FA",
                    "#A78BFA",
                    "#F472B6",
                    "#34D399",
                    "#FBBF24",
                  ];
                  const color =
                    colors[Math.floor(Math.random() * colors.length)];

                  return (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        backgroundColor: color,
                        height: `${size}px`,
                        width: `${size}px`,
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                        animation: `float ${duration}s ease-in-out infinite ${delay}s`,
                        opacity: 0.7,
                        filter: "blur(1px)",
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}

          <style jsx global>{`
            @keyframes orbit {
              0% {
                transform: translate(-50%, -50%) rotate(0deg) translateX(30px)
                  rotate(0deg);
              }
              100% {
                transform: translate(-50%, -50%) rotate(360deg) translateX(30px)
                  rotate(-360deg);
              }
            }
            @keyframes float {
              0%,
              100% {
                transform: translateY(0) translateX(0);
              }
              25% {
                transform: translateY(-15px) translateX(10px);
              }
              50% {
                transform: translateY(5px) translateX(-10px);
              }
              75% {
                transform: translateY(10px) translateX(5px);
              }
            }
          `}</style>
        </div>
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
                              <SelectItem key={sub} value={sub.toLowerCase()}>
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

              <div className="flex gap-4 flex-wrap">
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
                          //   onAccountChange(value);
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
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          console.log(checked);
                          if (!checked) {
                            form.setValue("recurringInterval", undefined, {
                              shouldValidate: true,
                            });
                          }
                        }}
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
            {isSubmitting ? (
              <Button disabled size="lg" className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </Button>
            ) : (
              <Button type="submit" size="lg" className="w-full">
                {submitButtonText}
              </Button>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default TransactionForm;
