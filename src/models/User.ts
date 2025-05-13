import mongoose, { Document, Schema } from "mongoose";

export enum AuthProvider {
  CREDENTIALS = "credentials",
  GOOGLE = "google",
}
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  verifyCode?: string | null;
  verifyCodeExpiry?: Date | null;
  isVerified: boolean;
  provider: AuthProvider;
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: function (this: IUser) {
      return this.provider === AuthProvider.CREDENTIALS;
    },
  },
  provider: {
    type: String,
    enum: Object.values(AuthProvider),
    default: AuthProvider.CREDENTIALS,
  },
  verifyCode: {
    type: String,
    required: function (this: IUser) {
      return this.provider === AuthProvider.CREDENTIALS;
    },
    default: null,
  },
  verifyCodeExpiry: {
    type: Date,
    required: function (this: IUser) {
      return this.provider === AuthProvider.CREDENTIALS;
    },
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
