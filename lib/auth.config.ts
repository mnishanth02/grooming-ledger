import { findUserByEmail } from "@/data/data-access/auth.queries";
import { env } from "@/data/env/server-env";
import db from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import type { usersInsertSchema } from "@/drizzle/schema/auth";
import { OAuthAccountAlreadyLinkedError } from "@/lib/error";
import { DEFAULT_SIGNIN_REDIRECT } from "@/lib/routes";
import { verifyPassword } from "@/lib/utils/hash";
import { SigninSchema } from "@/lib/validator/auth-validtor";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq, getTableColumns } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { z } from "zod";
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = SigninSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await findUserByEmail(email);

          if (!user.success || !user.data) return null;

          if (!user.data.hashedPassword) throw new OAuthAccountAlreadyLinkedError();
          // const passwordsMatch = await argon2.verify(user.data.hashedPassword, password);
          const passwordsMatch = await verifyPassword(password, user.data.hashedPassword);

          if (passwordsMatch) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { hashedPassword, ...userWithoutPassword } = user.data;
            console.log("[] userWithoutPassword", userWithoutPassword);

            return userWithoutPassword;
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: env.AUTH_SECRET,
  pages: { signIn: "/auth/sign-in" },

  adapter: {
    ...DrizzleAdapter(db, {
      accountsTable: schema.accounts,
      usersTable: schema.users,
    }),
    createUser: async (user) => {
      const { id, ...insertData } = user;
      // const hasDefaultId = getTableColumns(schema.users)["id"]["hasDefault"];
      const hasDefaultId = getTableColumns(schema.users).id.hasDefault;

      const newUser: z.infer<typeof usersInsertSchema> = {
        ...insertData,
        isActive: true,
      };

      const dbUser = await db
        .insert(schema.users)
        .values(hasDefaultId ? newUser : { id, ...newUser })
        .returning()
        .then((res) => res[0]);

      return dbUser;
    },
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;

      // Protected routes that require authentication
      const protectedPaths = [
        "/profile",
        "/orders",
        "/cart",
        "/checkout",
        "/wishlist",
        "/settings",
      ];

      const isProtectedPath = protectedPaths.some((path) => nextUrl.pathname.startsWith(path));

      // Admin/staff only routes
      const adminPaths = ["/admin", "/dashboard"];
      const isAdminPath = adminPaths.some((path) => nextUrl.pathname.startsWith(path));

      if (isProtectedPath || isAdminPath) {
        if (!isLoggedIn) {
          return false; // Redirect to sign in
        }

        // For admin paths, check role
        if (isAdminPath) {
          const userRole = auth?.user?.role;
          return userRole === "manager" || userRole === "assessor" || userRole === "groomer";
        }

        return true;
      }

      // Auth pages redirect logged in users
      const isAuthPath = nextUrl.pathname.startsWith("/auth");
      if (isAuthPath && isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (!token.maxAge) {
        token.maxAge = 30 * 24 * 60 * 60;
      }

      if (user?.id) {
        const dbUser = await db.query.users.findFirst({
          where: eq(schema.users.id, user.id),
          columns: {
            id: true,
            role: true,
            isActive: true,
            name: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.isActive = dbUser.isActive ?? false;
        }
      }

      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "manager" | "assessor" | "groomer" | "candidate";
        session.user.isActive = token.isActive as boolean;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
