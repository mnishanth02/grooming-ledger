"use client";

import { InputWithLabel } from "@/components/common/input-with-label";
import { TextareaWithLabel } from "@/components/common/textarea-with-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetFooter } from "@/components/ui/sheet";
import { updateTopic } from "@/data/actions/topic.actions";
import type { TopicWithSubtopics } from "@/data/data-access/topic.queries";
import { type UpdateTopicInput, updateTopicSchema } from "@/lib/validator/topic-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { type Control, type FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";
import SubtopicFormSection, { type TopicFormType } from "./subtopic-form-section";
import { parseDbError } from "./utils/topic-utils";

interface EditTopicFormProps {
  teamId: string;
  topic: TopicWithSubtopics;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTopicForm = ({ teamId, topic, onClose, onSuccess }: EditTopicFormProps) => {
  // Initialize form based on existing topic data
  const initialSubtopics =
    topic?.subTopics?.map((st) => ({
      id: st.id,
      name: st.name,
      description: st.description || "",
    })) || [];

  const form = useForm<UpdateTopicInput>({
    resolver: zodResolver(updateTopicSchema),
    defaultValues: {
      teamId,
      id: topic.id,
      name: topic.name || "",
      description: topic.description || "",
      category: topic.category || "",
      subtopics: initialSubtopics,
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateTopic, {
    onExecute: () => {
      // Clear any previous form errors
      form.clearErrors();
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Topic updated successfully");
      onSuccess();
      onClose();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        const parsedError = parseDbError(error.error.serverError);

        if (parsedError.field) {
          // Set field-specific error
          form.setError(parsedError.field as FieldPath<UpdateTopicInput>, {
            type: "manual",
            message: parsedError.message,
          });
        } else {
          // Set general server error
          form.setError("root", {
            type: "manual",
            message: parsedError.message,
          });
        }

        toast.error(parsedError.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const onSubmit = async (data: UpdateTopicInput) => {
    await executeUpdate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Folder className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-medium">Topic Information</h3>
          </div>
        </div>

        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="space-y-4 rounded-lg bg-muted/40 p-4">
          <InputWithLabel
            fieldTitle="Category"
            nameInSchema="category"
            placeholder="Enter category"
          />
          <InputWithLabel
            fieldTitle="Topic Name"
            nameInSchema="name"
            placeholder="Enter topic name"
          />

          <TextareaWithLabel
            fieldTitle="Description (Optional)"
            nameInSchema="description"
            placeholder="Enter a description of this topic"
          />
        </div>

        <SubtopicFormSection control={form.control as Control<TopicFormType>} name="subtopics" />

        <SheetFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Update Topic"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default EditTopicForm;
