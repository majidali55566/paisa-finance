"use client";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

const VerifyEmail = () => {
  const params = useParams<{ email: string }>();
  const [isSubmitting, setisSubmitting] = useState(false);
  const decodedEmail = decodeURIComponent(params.email);

  const router = useRouter();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });
  const onsubmit = async (data: z.infer<typeof verifySchema>) => {
    setisSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/users/verify-otp", {
        code: data.code,
        decodedEmail,
      });
      if (response.status === 200) {
        toast.success("Verification successfull", {
          description: "Please login now",
        });
        router.replace("/login");
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data.message ||
        "There was a problem with your sign-up. Please try again.";

      if (error?.status === 409) {
        toast.success("Already varified", {
          description: "email is already varified.please login!",
        });
        router.replace("/login");
      } else {
        toast.error("OTP Verification failed!", { description: errorMessage });
      }
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <div className="grid items-center justify-center min-h-screen bg-gray-100">
      <div className="grid max-w-80 gap-4 bg-white border-gray-300 p-6 rounded-2xl">
        <h1 className="font-bold">OTP VERIFICATION</h1>
        <p>Enter the code we have sent to your email</p>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)}>
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pb-2.5">
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default VerifyEmail;
