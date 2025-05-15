import mongoose, { Document, Model, Schema } from "mongoose";

export enum AccountType {
  CURRENT = "current",
  SAVINGS = "savings",
}
export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  accountType: AccountType;
  balance: number;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AccountMongoSchema: Schema<IAccount> = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    accountType: {
      type: String,
      enum: Object.values(AccountType),
      required: true,
    },
    balance: { type: Number, default: 0, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AccountModel: Model<IAccount> =
  (mongoose.models?.Account as Model<IAccount>) ||
  mongoose.model<IAccount>("Account", AccountMongoSchema);

export default AccountModel;
