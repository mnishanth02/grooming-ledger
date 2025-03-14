"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPassword, resetPassword } from "@/data/actions/auth.actions";
import {
  ForgotPasswordSchema,
  type ForgotPasswordSchemaType,
  ResetPasswordSchema,
  type ResetPasswordSchemaType,
} from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AppDialog from "../common/app-dialog";
import { InputWithLabel } from "../common/input-with-label";

export const ForgotPasswordForm = () => {
  const [forgotPassserverError, setForgotPassServerError] = useState<string | null>(null);
  const [resetPassserverError, setResetPassServerError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const forgotForm = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const resetForm = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const { execute: executeForgotPass, isPending: isForgotPassPending } = useAction(forgotPassword, {
    onExecute: () => {
      setEmail("");
      setForgotPassServerError(null);
    },
    onSuccess: (data) => {
      setEmail(data.data?.email || "");
      forgotForm.reset();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setForgotPassServerError(error.error.serverError);
      } else {
        setForgotPassServerError("Something went wrong");
      }
    },
  });

  const { execute: executeResetPassword, isPending: isResetPassPending } = useAction(
    resetPassword,
    {
      onExecute: () => {
        setResetPassServerError(null);
      },
      onSuccess: (data) => {
        toast.success(data.data?.message || "Password reset successfully");
        resetForm.reset();
        setEmail("");
        setIsDialogOpen(false);
        router.push("/auth/sign-in");
      },
      onError: (error) => {
        if (error.error?.serverError) {
          setResetPassServerError(error.error.serverError);
        } else if (error.error?.validationErrors) {
          for (const [field] of Object.entries(error.error.validationErrors)) {
            if (field in resetForm.getValues()) {
              resetForm.setError(field as keyof ResetPasswordSchemaType, {
                message: String(error),
              });
            }
          }
        } else {
          setResetPassServerError("An unexpected error occurred");
        }
      },
    },
  );

  const onSubmitForgotPass = (data: ForgotPasswordSchemaType) => {
    executeForgotPass(data);
  };

  const onSubmitResetForm = (values: ResetPasswordSchemaType) => {
    executeResetPassword({
      email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  const resetPassFormContent = (
    <Form {...resetForm}>
      <form className="space-y-4">
        {resetPassserverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {resetPassserverError}
          </div>
        )}

        <div className="space-y-4">
          <InputWithLabel
            fieldTitle="New Password"
            nameInSchema="password"
            type="password"
            placeholder="Enter your new password"
            className="h-11"
          />

          <InputWithLabel
            fieldTitle="Confirm Password"
            nameInSchema="confirmPassword"
            type="password"
            placeholder="Enter your new password"
            className="h-11"
          />
        </div>

        <Button
          type="button"
          onClick={resetForm.handleSubmit(onSubmitResetForm)}
          className="h-11 w-full"
          disabled={isResetPassPending}
        >
          {isResetPassPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );

  const forgotPassFormContent = (
    <Form {...forgotForm}>
      <form className="space-y-4">
        {forgotPassserverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {forgotPassserverError}
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={forgotForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="email"
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="button"
          onClick={forgotForm.handleSubmit(onSubmitForgotPass)}
          className="h-11 w-full"
          disabled={isForgotPassPending}
        >
          {isForgotPassPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>
    </Form>
  );

  return (
    <AppDialog
      trigger={
        <span className="flex-1 text-end text-sm hover:cursor-pointer hover:underline">
          Forgot Password
        </span>
      }
      title="Enter Your Email"
      message="We will validate your email"
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      showButtons={false}
      customContent={email ? resetPassFormContent : forgotPassFormContent}
    />
  );
};
