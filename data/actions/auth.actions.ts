"use server";

import { actionClient } from "@/lib/utils/safe-action";
import { z } from "zod";
import {
  forgotPasswordQuery,
  resetPasswordQuery,
  signinQuery,
  signupQuery,
} from "@/data/data-access/auth.queries";
import { ForgotPasswordSchema, SigninSchema, SignupSchema } from "@/lib/validator/auth-validtor";
import { ActionError } from "@/lib/error";

// Signup action
export const signup = actionClient
  .metadata({
    actionName: "signup",
    requiresAuth: false
  })
  .schema(SignupSchema)
  .action(async ({ parsedInput }) => {
    const result = await signupQuery(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create account");
    }

    return {
      userId: result.data?.userId,
      message: result.data?.message || "Account created successfully"
    };
  });

// Signin action
export const signin = actionClient
  .metadata({
    actionName: "signin",
    requiresAuth: false
  })
  .schema(SigninSchema)
  .action(async ({ parsedInput }) => {
    const result = await signinQuery(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to sign in");
    }

    return {
      message: result.data?.message || "Successfully signed in"
    };
  });

// Forgot password action
export const forgotPassword = actionClient
  .metadata({
    actionName: "forgotPassword",
    requiresAuth: false
  })
  .schema(ForgotPasswordSchema)
  .action(async ({ parsedInput }) => {
    const result = await forgotPasswordQuery(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to validte Email");
    }
    return {
      email: result.data?.email
    };
  });

// Reset password action
export const resetPassword = actionClient
  .metadata({
    actionName: "resetPassword",
    requiresAuth: false
  })
  .schema(z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  }))
  .action(async ({ parsedInput }) => {
    const { email, password, confirmPassword } = parsedInput;

    if (password !== confirmPassword) {
      throw new ActionError("Passwords do not match");
    }

    const result = await resetPasswordQuery(email, { password, confirmPassword });

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to reset password");
    }

    return {
      message: "Password reset successfully"
    };
  });
