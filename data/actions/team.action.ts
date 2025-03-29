"use server";

import { ActionError } from "@/lib/error";
import { authActionClient } from "@/lib/utils/safe-action";
import { TeamSchema } from "@/lib/validator/ui-validator";
import { z } from "zod";
import {
  createTeamQuery,
  deleteTeamQuery,
  getTeamByIdQuery,
  updateTeamQuery,
} from "../data-access/team.queries";

// Create team action
export const createTeam = authActionClient
  .metadata({
    actionName: "createTeam",
    requiresAuth: true,
  })
  .schema(TeamSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, description } = parsedInput;
    const { userId } = ctx;

    if (!userId) {
      throw new ActionError("User ID is required");
    }

    const result = await createTeamQuery({ name, description, userId });

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create team");
    }

    return {
      team: result.data,
      message: "Team created successfully",
    };
  });

// Update team action
export const updateTeam = authActionClient
  .metadata({
    actionName: "updateTeam",
    requiresAuth: true,
  })
  .schema(
    z.object({
      teamId: z.string().min(1, "Team ID is required"),
      name: z
        .string()
        .min(1, "Team name is required")
        .max(255, "Team name cannot exceed 255 characters"),
      description: z
        .string()
        .min(1, "Team description is required")
        .max(255, "Team description cannot exceed 255 characters"),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { teamId, name, description } = parsedInput;
    const { userId } = ctx;

    // Verify team ownership (optional additional security check)
    const teamCheck = await getTeamByIdQuery(teamId, userId);
    if (!teamCheck.success) {
      throw new ActionError("You don't have permission to update this team");
    }

    const result = await updateTeamQuery(teamId, { name, description });

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to update team");
    }

    return {
      team: result.data,
      message: "Team updated successfully",
    };
  });

// Delete team action
export const deleteTeam = authActionClient
  .metadata({
    actionName: "deleteTeam",
    requiresAuth: true,
  })
  .schema(
    z.object({
      teamId: z.string().min(1, "Team ID is required"),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { teamId } = parsedInput;
    const { userId } = ctx;

    // Verify team ownership (optional additional security check)
    const teamCheck = await getTeamByIdQuery(teamId, userId);
    if (!teamCheck.success) {
      throw new ActionError("You don't have permission to delete this team");
    }

    const result = await deleteTeamQuery(teamId);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to delete team");
    }

    return {
      team: result.data,
      message: "Team deleted successfully",
    };
  });
