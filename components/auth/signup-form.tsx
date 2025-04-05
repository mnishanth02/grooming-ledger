"use client";

import { signup } from "@/data/actions/auth.actions";
import { userRoleEnum } from "@/drizzle/schema";
import type { TeamType } from "@/drizzle/schema/grooming";
import { SignupSchema, type SignupSchemaType } from "@/lib/validator/auth-validtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AppDialog from "../common/app-dialog";
import { InputWithLabel } from "../common/input-with-label";
import { SelectWithLabel } from "../common/select-with-label";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

export const SignUpForm: FC<{ teams: TeamType[] }> = ({ teams }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "ASSOCIATE",
      password: "",
      teamId: "",
    },
    mode: "onSubmit",
  });

  const { execute } = useAction(signup, {
    onExecute: () => {
      setIsSubmitting(true);
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Account created successfully!");
      form.reset();
      setIsDialogOpen(true);
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setServerError(error.error.serverError);
      } else {
        setServerError("Something went wrong");
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: SignupSchemaType) => {
    execute(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            <InputWithLabel
              fieldTitle="Name"
              nameInSchema="name"
              placeholder="Enter your name"
              type="text"
              autoComplete="name"
            />
            <InputWithLabel
              fieldTitle="Email"
              nameInSchema="email"
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
            />

            <InputWithLabel
              fieldTitle="Password"
              nameInSchema="password"
              placeholder="Create a password"
              type="password"
              autoComplete="new-password"
            />

            <SelectWithLabel
              fieldTitle="Role"
              nameInSchema="role"
              placeholder="Select a role"
              options={userRoleEnum.enumValues
                .filter((role) => role !== "ADMIN")
                .map((role) => ({
                  value: role,
                  label: role,
                }))}
              className="w-60 md:w-full"
            />

            {teams.length > 0 && form.watch("role") === "ASSOCIATE" && (
              <SelectWithLabel
                fieldTitle="Team"
                nameInSchema="teamId"
                placeholder="Select a team"
                options={teams.map((team) => ({
                  value: team.id,
                  label: team.name,
                }))}
              />
            )}
          </div>

          <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Welcome! 🎉"
        message="Account created Successfully."
        showSecondaryButton={false}
        primaryButton={{
          text: "Continue to Sign In",
          variant: "default",
          onClick: () => router.push("/auth/sign-in"),
        }}
        className="sm:max-w-md"
      />
    </>
  );
};
