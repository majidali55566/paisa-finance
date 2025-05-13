import mongoose, { Document, Schema } from "mongoose";

export enum TransactionType {
  EXPENSE = "expense",
  INCOME = "income",
}

export enum RecurringInterval {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  description?: string;
  transactionDate?: Date;
  category?: string;
  subcategory?: string;
  receiptUrl?: string;
  isRecurring: boolean;
  recurringInterval?: RecurringInterval;
  nextRecurringDate?: Date;
  lastProcessed?: Date;
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    accountId: { type: Schema.Types.ObjectId, required: true, ref: "Account" },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    description: { type: String },
    transactionDate: { type: Date, default: Date.now },
    category: { type: String },
    receiptUrl: { type: String },
    isRecurring: { type: Boolean, default: false },
    recurringInterval: {
      type: String,
      enum: Object.values(RecurringInterval),
      required: function (this: ITransaction) {
        return this.isRecurring;
      },
    },
    nextRecurringDate: { type: Date },
    lastProcessed: { type: Date },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.COMPLETED,
    },
  },
  { timestamps: true }
);

const TransactionModel =
  (mongoose.models?.Transaction as mongoose.Model<ITransaction>) ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default TransactionModel;
