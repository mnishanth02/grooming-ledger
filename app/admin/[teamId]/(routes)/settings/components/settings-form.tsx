"use client";

import { InputWithLabel } from "@/components/common/input-with-label";
import { TextareaWithLabel } from "@/components/common/textarea-with-label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { updateTeam } from "@/data/actions/team.action";
import type { UserType } from "@/drizzle/schema/auth";
import type { TeamType } from "@/drizzle/schema/grooming";
import { TeamSchema, type TeamsSchemaType } from "@/lib/validator/ui-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Moon, Sun, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SettingsFormProps {
  team: TeamType;
  user: UserType; // Using any for now as the User type is causing issues
}

export function SettingsForm({ team, user }: SettingsFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { theme: currentTheme, setTheme } = useTheme();
  // Set default theme as light when undefined (for SSR)
  const theme = currentTheme || "light";

  const form = useForm<TeamsSchemaType>({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      name: team.name || "",
      description: team.description || "",
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateTeam, {
    onExecute: () => setServerError(null),
    onSuccess: (data) => {
      router.refresh();
      toast.success(data.data?.message || "Team settings updated successfully");
    },
    onError: (error) => {
      const errorMsg = error.error?.serverError || "Failed to update team settings";
      setServerError(errorMsg);
      toast.error(errorMsg);
    },
  });

  function onSubmit(data: TeamsSchemaType) {
    executeUpdate({
      teamId: team.id,
      name: data.name,
      description: data.description,
    });
  }

  return (
    <div className="space-y-6">
      {/* Team Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>Update your team name and description</CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
              {serverError}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputWithLabel
                fieldTitle="Team Name"
                nameInSchema="name"
                placeholder="Enter team name"
                disabled={isUpdating}
              />
              <TextareaWithLabel
                fieldTitle="Description"
                nameInSchema="description"
                placeholder="Enter team description"
                disabled={isUpdating}
              />
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the appearance of the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <div className="font-medium">Theme</div>
              <div className="text-muted-foreground text-sm">
                Select the theme for the dashboard
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="gap-1"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="gap-1"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Manager Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Manager</CardTitle>
          <CardDescription>Information about the project manager for this team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground text-sm">{user.email}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
