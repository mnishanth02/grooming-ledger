import "server-only";

import db from "@/drizzle/db";
import { subTopics, topics } from "@/drizzle/schema/grooming";
import type { ApiResponse } from "@/types/api";
import { and, eq, inArray } from "drizzle-orm";
import { asc } from "drizzle-orm";

/**
 * Fetches all topics along with their associated subtopics.
 * Orders topics and subtopics by name alphabetically.
 * @returns {Promise<Array<TopicWithSubtopics>>} A promise that resolves to an array of topics, each including its subtopics.
 */
export async function getTopicsWithSubtopics() {
  const data = await db.query.topics.findMany({
    with: {
      subTopics: {
        orderBy: (subTopics, { asc }) => [asc(subTopics.name)], // Order subtopics by name
      },
    },
    orderBy: asc(topics.name), // Order topics by name
  });
  return data;
}

// Define the type based on the return type of the query function
export type TopicWithSubtopics = Awaited<ReturnType<typeof getTopicsWithSubtopics>>[number];

// ******************************************************
// *******************  createTopicQuery ****************
// ******************************************************
export async function createTopicQuery(data: {
  name: string;
  description: string | null;
  category: string | null;
  subtopics?: Array<{ name: string; description: string | null }>;
}): Promise<ApiResponse<TopicWithSubtopics>> {
  try {
    const { name, description, category, subtopics: inputSubtopics } = data;

    // 1. Insert the main topic
    const [insertedTopic] = await db
      .insert(topics)
      .values({
        name,
        description,
        category,
      })
      .returning();

    // 2. Insert subtopics if provided
    if (inputSubtopics && inputSubtopics.length > 0) {
      const subtopicsToInsert = inputSubtopics.map((sub) => ({
        name: sub.name,
        description: sub.description,
        topicId: insertedTopic.id,
      }));
      await db.insert(subTopics).values(subtopicsToInsert);
    }

    // Get the full topic with subtopics
    const fullTopic = await db.query.topics.findFirst({
      where: eq(topics.id, insertedTopic.id),
      with: {
        subTopics: true,
      },
    });

    if (fullTopic) {
      return {
        success: true,
        data: fullTopic,
        message: "Topic created successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 500,
        message: "Failed to create topic",
      },
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

// ******************************************************
// *******************  updateTopicQuery ****************
// ******************************************************
export async function updateTopicQuery(
  topicId: string,
  data: {
    name?: string;
    description?: string | null;
    category?: string | null;
    subtopics?: Array<{
      id?: string;
      name: string;
      description: string | null;
    }>;
  },
): Promise<ApiResponse<TopicWithSubtopics>> {
  try {
    const { subtopics: inputSubtopics, ...topicData } = data;

    // 1. Update the main topic details if provided
    if (Object.keys(topicData).length > 0) {
      await db.update(topics).set(topicData).where(eq(topics.id, topicId));
    }

    // 2. Handle subtopics if provided
    if (inputSubtopics) {
      // Get existing subtopics
      const existingTopicWithSubtopics = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
        with: {
          subTopics: {
            columns: { id: true },
          },
        },
      });

      if (!existingTopicWithSubtopics) {
        throw new Error("Topic not found");
      }

      const existingSubtopicIds = existingTopicWithSubtopics.subTopics.map((st) => st.id);
      const inputSubtopicIds = inputSubtopics.map((st) => st.id).filter((id): id is string => !!id);

      // Subtopics to Add (those in input without an ID)
      const subtopicsToAdd = inputSubtopics
        .filter((st) => !st.id)
        .map((st) => ({
          name: st.name,
          description: st.description,
          topicId,
        }));

      // Subtopics to Update (those in input with an ID)
      const subtopicsToUpdate = inputSubtopics.filter((st): st is Required<typeof st> => !!st.id);

      // Subtopics to Delete (those in DB but not in input)
      const subtopicIdsToDelete = existingSubtopicIds.filter(
        (id) => !inputSubtopicIds.includes(id),
      );

      // Perform DB operations
      if (subtopicsToAdd.length > 0) {
        await db.insert(subTopics).values(subtopicsToAdd);
      }

      if (subtopicsToUpdate.length > 0) {
        for (const sub of subtopicsToUpdate) {
          await db
            .update(subTopics)
            .set({ name: sub.name, description: sub.description })
            .where(eq(subTopics.id, sub.id));
        }
      }

      if (subtopicIdsToDelete.length > 0) {
        await db
          .delete(subTopics)
          .where(and(eq(subTopics.topicId, topicId), inArray(subTopics.id, subtopicIdsToDelete)));
      }
    }

    // Get the updated topic with subtopics
    const updatedTopic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
      with: {
        subTopics: true,
      },
    });

    if (updatedTopic) {
      return {
        success: true,
        data: updatedTopic,
        message: "Topic updated successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Topic not found",
      },
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

// ******************************************************
// *******************  deleteTopicQuery ****************
// ******************************************************
export async function deleteTopicQuery(topicId: string): Promise<ApiResponse<{ name: string }>> {
  try {
    // The 'onDelete: cascade' in the schema should handle subtopic deletion
    const [deletedTopic] = await db
      .delete(topics)
      .where(eq(topics.id, topicId))
      .returning({ name: topics.name });

    if (deletedTopic) {
      return {
        success: true,
        data: deletedTopic,
        message: "Topic deleted successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Topic not found",
      },
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

// ******************************************************
// *******************  getTopicByIdQuery ****************
// ******************************************************
export async function getTopicByIdQuery(topicId: string): Promise<ApiResponse<TopicWithSubtopics>> {
  try {
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
      with: {
        subTopics: true,
      },
    });

    if (topic) {
      return {
        success: true,
        data: topic,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Topic not found",
      },
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
