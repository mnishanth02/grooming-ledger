import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import {
  getAllTeamByUserIdQuery,
  getTeamByIdQuery,
  getTeamByUserIdQuery,
} from "../data-access/team.queries";
import { checkAuth, getCurrentUserId } from "./auth.helper";

/**
 * Validate and get the user's primary store
 * Cached for reuse across the application
 */
export const validateUserTeam = cache(async () => {
  const userId = await getCurrentUserId();
  const response = await getTeamByUserIdQuery(userId);

  return {
    team: response.success ? response.data : null,
    userId,
  };
});

/**
 * Validate and get a specific store by ID
 * Cached per storeId for efficient reuse
 */
export const validateSpecificTeam = cache(async (teamId: string) => {
  const userId = await getCurrentUserId();
  const team = await getTeamByIdQuery(teamId, userId);

  if (!team.success) {
    console.log("[validateSpecificTeam] redirecting to admin");
    redirect("/admin");
  }

  return team.data;
});

/**
 * Get the user and store for a specific store ID
 * Cached per storeId for efficient reuse
 */
export const getTeamAndUser = cache(async (teamId: string) => {
  const user = await checkAuth();
  const team = await validateSpecificTeam(teamId);
  return { user, team };
});

/**
 * Get all stores for the current user
 * Cached for reuse across the application
 */
export const getAllTeamsByUserId = cache(async () => {
  const userId = await getCurrentUserId();
  const response = await getAllTeamByUserIdQuery(userId);

  // Return empty array if no stores found
  if (!response.success) {
    return [];
  }

  return response.data || [];
});

/**
 * Check if user has any stores
 * Useful for conditional UI rendering
 */
export const hasTeams = cache(async (): Promise<boolean> => {
  const teams = await getAllTeamsByUserId();
  return teams.length > 0;
});

/**
 * Get store by ID without redirection
 * Useful when you want to handle the not-found case yourself
 */
export const getTeamById = cache(async (teamId: string) => {
  const userId = await getCurrentUserId();
  const response = await getTeamByIdQuery(teamId, userId);
  return response.success ? response.data : null;
});
