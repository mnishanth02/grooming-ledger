import "server-only";

import { lower } from "@/data/helper/db-helper";
import db from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { signIn } from "@/lib/auth";
import { hashPassword } from "@/lib/utils/hash";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SigninSchema,
  type SignupSchemaType,
} from "@/lib/validator/auth-validtor";
import type { ApiResponse } from "@/types/api";
import { and, eq, isNull } from "drizzle-orm";
import { AuthError } from "next-auth";
import { z } from "zod";

// ******************************************************
// ******************* signupQuery **********************
// ******************************************************
export async function signupQuery(
  input: SignupSchemaType,
): Promise<ApiResponse<{ userId: string; message: string }>> {
  try {
    // Input sanitization
    const { email, password, name, role, teamId } = input;
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedName = name.trim();
    const sanitizedRole = role.trim() as "PROJECT MANAGER" | "ASSOCIATE" | "ADMIN" | "CANDIDATE";

    // Validate password strength
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        success: false,
        error: {
          code: 400,
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        },
      };
    }

    // Check for existing user
    const userResponse = await findUserByEmail(sanitizedEmail);
    if (userResponse.success && userResponse.data?.id) {
      return {
        success: false,
        error: {
          code: 409,
          message: "An account with this email already exists. Please sign in instead.",
        },
      };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        name: sanitizedName,
        email: sanitizedEmail,
        hashedPassword,
        role: sanitizedRole,
        isActive: true,
        emailVerified: new Date(),
        teamId: teamId ?? null,
      })
      .returning({
        id: users.id,
        email: users.email,
      })
      .then((res) => res[0]);

    if (!newUser?.email) {
      return {
        success: false,
        error: {
          code: 500,
          message: "Failed to create user record",
        },
      };
    }

    return {
      success: true,
      data: {
        userId: newUser.id,
        message: "Account created successfully. Please check your email for verification.",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// ******************* signinQuery **********************
// ******************************************************
export async function signinQuery(input: unknown): Promise<ApiResponse<{ message: string }>> {
  try {
    // Validate input with Zod
    const validatedInput = SigninSchema.parse(input);

    try {
      await signIn("credentials", { ...validatedInput, redirect: false });
      return {
        success: true,
        data: { message: "Successfully signed in" },
      };
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.type) {
          case "CredentialsSignin":
          case "CallbackRouteError":
            return {
              success: false,
              error: {
                code: 401,
                message: "Invalid credentials",
              },
            };
          case "AccessDenied":
            return {
              success: false,
              error: {
                code: 403,
                message: "Please verify your email, sign up again to resend verification email",
              },
            };
          case "OAuthAccountAlreadyLinked" as AuthError["type"]:
            return {
              success: false,
              error: {
                code: 409,
                message: "Login with your Google or Github account",
              },
            };
          default:
            return {
              success: false,
              error: {
                code: 500,
                message: "Oops. Something went wrong",
              },
            };
        }
      }
      throw err; // Re-throw unexpected errors
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// **************** findUserByEmail ********************
// ******************************************************
export async function findUserByEmail(
  email: unknown,
): Promise<ApiResponse<typeof users.$inferSelect | null>> {
  try {
    const schema = z.object({
      email: z.string().email("Invalid email format"),
    });
    const validatedData = schema.parse({ email });

    const user = await db
      .select()
      .from(users)
      .where(eq(lower(users.email), validatedData.email.toLowerCase()))
      .limit(1)
      .then((res) => res[0] ?? null);

    if (!user) {
      return {
        success: false,
        error: {
          code: 400,
          message: "Invalid email",
        },
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// **************** forgotPasswordAction ****************
// ******************************************************

export async function forgotPasswordQuery(
  input: unknown,
): Promise<ApiResponse<{ email?: string }>> {
  try {
    const validatedInput = ForgotPasswordSchema.parse(input);
    const email = validatedInput.email;

    try {
      const userResponse = await findUserByEmail(email);

      // this is a false positive, to deter malicious users
      if (!userResponse.success || !userResponse.data?.id) {
        return {
          success: true,
        };
      }

      const existingUser = userResponse.data;

      if (!existingUser.hashedPassword) {
        return {
          success: false,
          error: {
            code: 400,
            message: "This user was created with OAuth, please sign in with OAuth",
          },
        };
      }

      // const verificationTokenResponse = await createVerificationTokenAction(existingUser.email);

      // if (verificationTokenResponse.success && verificationTokenResponse.data) {
      //   await sendForgotPasswordEmail(existingUser.email, verificationTokenResponse.data.token);
      // }

      return {
        success: true,
        data: { email: existingUser.email },
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: {
          code: 500,
          message: "Internal Server Error",
        },
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 400,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// **************** resetPasswordQuery ****************
// ******************************************************

export async function resetPasswordQuery(
  email: (typeof users.$inferSelect)["email"],
  values: unknown,
): Promise<ApiResponse<void>> {
  try {
    const validatedValues = ResetPasswordSchema.parse(values);
    const password = validatedValues.password;

    console.log({ email, password });
    const existingUserResponse = await findUserByEmail(email);

    if (
      !existingUserResponse.success ||
      !existingUserResponse.data ||
      existingUserResponse.data.email.toLowerCase() !== email.toLowerCase()
    ) {
      return {
        success: false,
        error: {
          code: 400,
          message: "Oops, something went wrong",
        },
      };
    }

    const hashedPassword = await hashPassword(password);

    await db.update(users).set({ hashedPassword }).where(eq(users.email, email));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

//  get all users by teamId
export async function getAllUsersByTeamId(
  teamId: string,
): Promise<ApiResponse<(typeof users.$inferSelect)[]>> {
  try {
    const usersData = await db
      .select()
      .from(users)
      .where(and(eq(users.teamId, teamId), isNull(users.deletedAt)));

    if (usersData.length === 0) {
      return {
        success: false,
        error: {
          code: 404,
          message: "No users found",
        },
      };
    }

    return {
      success: true,
      data: usersData,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
