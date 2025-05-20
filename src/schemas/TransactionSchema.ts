import {
  RecurringInterval,
  TransactionStatus,
  TransactionType,
} from "@/models/transaction";
import { z } from "zod";

export const TransactionSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().optional(),
  accountId: z.string().min(1, "Account is required"),
  amount: z.string().min(1, "Transaction amount is required"),
  type: z.nativeEnum(TransactionType),
  description: z.string().optional(),
  transactionDate: z.date({ message: "Transaction date" }).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  receiptUrl: z.string().optional(),
  isRecurring: z.boolean().default(false),
  nextRecurringDate: z.date().optional(),
  lastProcessed: z.date().optional(),
  status: z.nativeEnum(TransactionStatus),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  recurringInterval: z.nativeEnum(RecurringInterval).optional().nullable(),
});

export const CreateTransactionSchema = TransactionSchema.omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).refine(
  (data) => {
    return !data.isRecurring || !!data.recurringInterval;
  },
  {
    message: "Recurring interval is required when transaction is recurring",
    path: ["recurringInterval"],
  }
);

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
