import "server-only";

import { auth } from "@/lib/auth";
import type { User } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";
/**
 * Check authentication and return user with guaranteed ID
 * This function is not cached as it should always check the current session
 */
export const checkAuth = async (): Promise<User> => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  return {
    ...session.user,
    id: session.user.id,
  };
};

/**
 * Get the current user's ID - cached for reuse across functions
 */
export const getCurrentUserId = cache(async (): Promise<string> => {
  const user = await checkAuth();
  if (!user.id) {
    redirect("/auth/sign-in");
  }
  return user.id;
});
