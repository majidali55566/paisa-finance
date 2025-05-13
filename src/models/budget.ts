import mongoose, { Document, Schema } from "mongoose";

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  lastAlertSent?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const BudgetSchema: Schema<IBudget> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    lastAlertSent: { type: Date },
  },
  { timestamps: true }
);

const BudgetModel =
  (mongoose.models.Budget as mongoose.Model<IBudget>) ||
  mongoose.model<IBudget>("Budget", BudgetSchema);

export default BudgetModel;
