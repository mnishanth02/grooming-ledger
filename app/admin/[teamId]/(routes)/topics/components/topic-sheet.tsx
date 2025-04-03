"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { deleteTopic } from "@/data/actions/topic.actions";
import type { TopicWithSubtopics } from "@/data/data-access/topic.queries";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateTopicForm from "./create-topic-form";
import DeleteTopicDialog from "./delete-topic-dialog";
import EditTopicForm from "./edit-topic-form";
import TopicDetails from "./topic-details";

interface TopicSheetProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: TopicWithSubtopics;
}

const TopicSheet = ({ isOpen, onClose, topic }: TopicSheetProps) => {
  const params = useParams();
  const teamId = params.teamId as string;
  const isNewTopic = topic?.id === "new";
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Reset view mode when sheet opens/closes
  useEffect(() => {
    if (!isOpen) {
      // When closing, reset after a short delay to prevent visual jumps
      const timer = setTimeout(() => {
        setViewMode("view");
      }, 300);
      return () => clearTimeout(timer);
    }

    // When opening and it's not a new topic, ensure we start in view mode
    if (!isNewTopic) {
      setViewMode("view");
    }
  }, [isOpen, isNewTopic]);

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteTopic, {
    onSuccess: (data) => {
      toast.success(data.data?.message || "Topic deleted successfully");
      onClose();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        toast.error(error.error.serverError);
      } else {
        toast.error("Something went wrong");
      }
    },
    onSettled: () => {
      setShowDeleteAlert(false);
    },
  });

  // Handle delete action
  const onDelete = () => {
    if (!topic || topic.id === "new") return;

    executeDelete({
      id: topic.id,
      teamId,
    });
  };

  const handleEditClick = () => {
    setViewMode("edit");
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  // Main render function
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full max-w-md overflow-y-auto px-3 sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {isNewTopic
                ? "Create New Topic"
                : viewMode === "edit"
                  ? "Edit Topic"
                  : "Topic Details"}
            </SheetTitle>
            {isNewTopic && <SheetDescription>Add a new topic with subtopics.</SheetDescription>}
          </SheetHeader>

          <Separator />

          {isNewTopic && <CreateTopicForm teamId={teamId} onClose={onClose} />}

          {!isNewTopic && viewMode === "edit" && topic && (
            <EditTopicForm
              teamId={teamId}
              topic={topic}
              onClose={() => setViewMode("view")}
              onSuccess={onClose}
            />
          )}

          {!isNewTopic && viewMode === "view" && topic && (
            <TopicDetails
              topic={topic}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isDeleting={isDeleting}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Alert */}
      <DeleteTopicDialog
        isOpen={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default TopicSheet;
