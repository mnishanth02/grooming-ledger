"use server";

import { ActionError } from "@/lib/error";
import { ADMIN_ROUTES } from "@/lib/routes";
import { teamActionClient } from "@/lib/utils/safe-action";
import {
  createTopicSchema,
  deleteTopicSchema,
  updateTopicSchema,
} from "@/lib/validator/topic-validator";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createTopicQuery,
  deleteTopicQuery,
  getTopicByIdQuery,
  getTopicsAsOptionsQuery,
  updateTopicQuery,
} from "../data-access/topic.queries";

// --- Create Topic Action ---
export const createTopic = teamActionClient
  .metadata({
    actionName: "createTopic",
    requiresAuth: true,
  })
  .schema(createTopicSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { name, description, category, subtopics, teamId } = parsedInput;

      const result = await createTopicQuery({
        name,
        description: description ?? null,
        category: category ?? null,
        teamId,
        subtopics: subtopics?.map((sub) => ({
          name: sub.name,
          description: sub.description ?? null,
        })),
      });

      if (!result.success) {
        throw new ActionError(result.error.message || "Failed to create topic");
      }

      if (!result.data) {
        throw new ActionError("Topic created but no data returned");
      }

      revalidatePath(ADMIN_ROUTES.TOPICS(teamId));

      return {
        topic: result.data,
        message: `Topic "${result.data.name}" created successfully`,
      };
    } catch (error) {
      console.error("Error creating topic:", error);
      throw new ActionError(error instanceof Error ? error.message : "Failed to create topic");
    }
  });

// --- Update Topic Action ---
export const updateTopic = teamActionClient
  .metadata({
    actionName: "updateTopic",
    requiresAuth: true,
  })
  .schema(updateTopicSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id: topicId, subtopics, teamId, ...topicData } = parsedInput;

      // Verify topic exists
      const topicCheck = await getTopicByIdQuery(topicId);
      if (!topicCheck.success) {
        throw new ActionError("Topic not found");
      }

      const result = await updateTopicQuery(topicId, {
        ...topicData,
        teamId,
        subtopics: subtopics?.map((sub) => ({
          id: sub.id,
          name: sub.name,
          description: sub.description ?? null,
        })),
      });

      if (!result.success) {
        throw new ActionError(result.error.message || "Failed to update topic");
      }

      if (!result.data) {
        throw new ActionError("Topic updated but no data returned");
      }

      revalidatePath(ADMIN_ROUTES.TOPICS(teamId));

      return {
        topic: result.data,
        message: "Topic updated successfully",
      };
    } catch (error) {
      console.error("Error updating topic:", error);
      throw new ActionError(error instanceof Error ? error.message : "Failed to update topic");
    }
  });

// --- Delete Topic Action ---
export const deleteTopic = teamActionClient
  .metadata({
    actionName: "deleteTopic",
    requiresAuth: true,
  })
  .schema(deleteTopicSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, teamId } = parsedInput;

      // Verify topic exists
      const topicCheck = await getTopicByIdQuery(id);
      if (!topicCheck.success) {
        throw new ActionError("Topic not found");
      }

      const result = await deleteTopicQuery(id);

      if (!result.success) {
        throw new ActionError(result.error.message || "Failed to delete topic");
      }

      if (!result.data) {
        throw new ActionError("Topic deleted but no data returned");
      }

      revalidatePath(ADMIN_ROUTES.TOPICS(teamId));

      return {
        message: `Topic "${result.data.name}" deleted successfully`,
      };
    } catch (error) {
      console.error("Error deleting topic:", error);
      throw new ActionError(error instanceof Error ? error.message : "Failed to delete topic");
    }
  });

// --- Get Topic Options Action ---
export const getTopicOptions = teamActionClient
  .metadata({
    actionName: "getTopicOptions",
    requiresAuth: true,
  })
  .schema(
    z.object({
      teamId: z.string().min(1, "Team ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const { teamId } = parsedInput;

      const result = await getTopicsAsOptionsQuery(teamId);

      if (!result.success) {
        throw new ActionError(result.error?.message || "Failed to fetch topics");
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Error fetching topic options:", error);
      throw new ActionError(error instanceof Error ? error.message : "Failed to fetch topics");
    }
  });
