import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(2, "username Must be atleast 2 characters")
    .max(20, "username must not be more than 20 characters"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "password must be atleast 6 characters long"),
});
