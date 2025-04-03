import * as z from "zod";

// Schema for a single subtopic within the form
const subtopicSchema = z.object({
  id: z.string().optional(), // Present for existing subtopics during update
  name: z.string().min(1, { message: "Subtopic name cannot be empty." }),
  description: z.string().optional(),
});

// Schema for creating a new topic
export const createTopicSchema = z.object({
  teamId: z.string(), // Required by teamActionClient
  name: z.string().min(1, { message: "Topic name cannot be empty." }),
  description: z.string().optional(),
  category: z.string().optional(),
  subtopics: z.array(subtopicSchema).optional(), // Array of subtopics
});

// Schema for updating an existing topic
export const updateTopicSchema = z.object({
  id: z.string(), // ID of the topic to update
  teamId: z.string(), // Required by teamActionClient
  name: z.string().min(1, { message: "Topic name cannot be empty." }).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  subtopics: z.array(subtopicSchema).optional(), // Array of subtopics (includes potential updates/adds/deletes)
});

// Schema for deleting a topic (usually just needs the ID)
export const deleteTopicSchema = z.object({
  id: z.string(),
  teamId: z.string(), // Required by teamActionClient
});

// Infer types from schemas
export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
export type DeleteTopicInput = z.infer<typeof deleteTopicSchema>;
export type SubtopicInput = z.infer<typeof subtopicSchema>;
