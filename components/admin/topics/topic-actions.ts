"use client";

import { deleteTopic } from "@/data/actions/topic.actions";

// Client-side wrapper functions for server actions
export async function deleteTopicAction(id: string, teamId: string) {
  return deleteTopic({ id, teamId });
}
