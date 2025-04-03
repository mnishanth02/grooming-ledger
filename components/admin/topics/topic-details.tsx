"use client";

import { DialogDescription } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import type { getTopicsWithSubtopics } from "@/data/data-access/topic.queries";
import { useState } from "react";
import { useTopicColumns } from "./topic-columns";
import { TopicDataTable } from "./topic-data-table";
import TopicForm from "./topic-form";

export default function TopicsDataTable({
  teamId,
  initialTopics,
}: {
  teamId: string;
  initialTopics: Awaited<ReturnType<typeof getTopicsWithSubtopics>>;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get columns configuration (includes edit & delete functionality)
  const columns = useTopicColumns(teamId);

  return (
    <>
      <TopicDataTable
        columns={columns}
        data={initialTopics}
        onAddNew={() => setIsAddDialogOpen(true)}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
            <DialogDescription>Create a new topic and add subtopics if needed.</DialogDescription>
          </DialogHeader>
          <TopicForm teamId={teamId} onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
