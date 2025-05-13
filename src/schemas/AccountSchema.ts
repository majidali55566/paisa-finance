import { z } from "zod";
import { AccountType } from "../models/Account";

export const AccountSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  accountType: z.nativeEnum(AccountType),
  balance: z.string().min(1, "Initial balance is required"),
  isDefault: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateAccountSchema = AccountSchema.omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAccountSchema = CreateAccountSchema.partial();

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;
export type UpdateAccount = z.infer<typeof UpdateAccountSchema>;
