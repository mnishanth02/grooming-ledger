"use server";

import { ActionError } from "@/lib/error";
import { authActionClient } from "@/lib/utils/safe-action";
import { z } from "zod";
import { searchPeopleQuery } from "../data-access/user.queries";

// ******************************************************
// **************  searchPeopleAction *******************
// ******************************************************
export const searchPeopleAction = authActionClient
  .metadata({
    actionName: "searchPeople",
    requiresAuth: true,
  })
  .schema(
    z.object({
      searchQuery: z.string().min(1, "Search query is required"),
      teamId: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { searchQuery, teamId } = parsedInput;

    const result = await searchPeopleQuery(searchQuery, teamId);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to search people");
    }

    return {
      data: result.data,
      message: "Search completed successfully",
    };
  });
