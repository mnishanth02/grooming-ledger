"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TopicWithSubtopics } from "@/data/data-access/topic.queries";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTopicAction } from "./topic-actions";

// Dynamically import TopicForm to avoid circular dependencies
const TopicForm = dynamic(() => import("./topic-form"), {
  ssr: false,
  loading: () => <div className="py-4 text-center">Loading form...</div>,
});

export const useTopicColumns = (teamId: string): ColumnDef<TopicWithSubtopics>[] => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<Record<string, boolean>>({});

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTopicAction(id, teamId);
      toast.success("Topic deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete topic");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleEditDialog = (id: string, isOpen: boolean) => {
    setEditDialogOpen((prev) => ({
      ...prev,
      [id]: isOpen,
    }));
  };

  return [
    {
      accessorKey: "name",
      header: "Topic Name",
      cell: ({ row }) => {
        const topic = row.original;
        return <div className="font-medium">{topic.name}</div>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string | null;
        return category ? (
          <div>{category}</div>
        ) : (
          <div className="text-muted-foreground italic">None</div>
        );
      },
    },
    {
      id: "subtopics",
      header: "Subtopics",
      cell: ({ row }) => {
        const topic = row.original;
        const subtopics = topic.subTopics || [];

        if (subtopics.length === 0) {
          return <div className="text-muted-foreground italic">No subtopics</div>;
        }

        // Show all subtopics with badges
        return (
          <div className="flex flex-wrap gap-1">
            {subtopics.map((subtopic) => (
              <Badge
                key={subtopic.id}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {subtopic.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const topic = row.original;
        const isOpen = editDialogOpen[topic.id] || false;
        const isDeleting = deletingId === topic.id;

        return (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleEditDialog(topic.id, true)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(topic.id)}
              disabled={isDeleting}
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>

            <Dialog open={isOpen} onOpenChange={(open) => toggleEditDialog(topic.id, open)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Topic</DialogTitle>
                  <DialogDescription>
                    Make changes to the topic and its subtopics.
                  </DialogDescription>
                </DialogHeader>
                <TopicForm
                  teamId={teamId}
                  existingTopic={topic}
                  onSuccess={() => toggleEditDialog(topic.id, false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];
};
