import { Resend } from "resend";
import { loadEnv } from "@/lib/env";
loadEnv();
export const resend = new Resend(process.env.RESEND_API_KEY);
