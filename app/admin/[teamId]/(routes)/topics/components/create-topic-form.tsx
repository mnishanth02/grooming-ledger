"use client";

import { InputWithLabel } from "@/components/common/input-with-label";
import { TextareaWithLabel } from "@/components/common/textarea-with-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetFooter } from "@/components/ui/sheet";
import { createTopic } from "@/data/actions/topic.actions";
import { type CreateTopicInput, createTopicSchema } from "@/lib/validator/topic-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { type Control, type FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";
import SubtopicFormSection, { type TopicFormType } from "./subtopic-form-section";
import { parseDbError } from "./utils/topic-utils";

interface CreateTopicFormProps {
  teamId: string;
  onClose: () => void;
}

const CreateTopicForm = ({ teamId, onClose }: CreateTopicFormProps) => {
  const form = useForm<CreateTopicInput>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      teamId,
      name: "",
      description: "",
      category: "",
      subtopics: [],
    },
  });

  const { execute: executeCreate, isPending: isCreating } = useAction(createTopic, {
    onExecute: () => {
      // Clear any previous form errors
      form.clearErrors();
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Topic created successfully");
      form.reset();
      onClose();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        const parsedError = parseDbError(error.error.serverError);

        if (parsedError.field) {
          // Set field-specific error
          form.setError(parsedError.field as FieldPath<CreateTopicInput>, {
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

  const onSubmit = async (data: CreateTopicInput) => {
    await executeCreate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-1.5">
              <FolderPlus className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-medium">Topic Information</h3>
          </div>
        </div>

        {form.formState.errors.root?.serverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {form.formState.errors.root.serverError.message}
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
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Saving..." : "Create Topic"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default CreateTopicForm;
