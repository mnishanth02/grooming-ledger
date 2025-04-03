"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTopic, updateTopic } from "@/data/actions/topic.actions";
import type { TopicWithSubtopics } from "@/data/data-access/topic.queries";
import {
  type CreateTopicInput,
  type UpdateTopicInput,
  createTopicSchema,
  updateTopicSchema,
} from "@/lib/validator/topic-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface TopicFormProps {
  teamId: string;
  existingTopic?: TopicWithSubtopics;
  onSuccess?: () => void;
}

function TopicForm({ teamId, existingTopic, onSuccess }: TopicFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!existingTopic;

  // Initialize form based on whether we're editing or creating
  const initialSubtopics =
    existingTopic?.subTopics?.map((st) => ({
      id: st.id,
      name: st.name,
      description: st.description || "",
    })) || [];

  const CreateFormComponent = () => {
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

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "subtopics",
    });

    const onSubmit = async (data: CreateTopicInput) => {
      setIsSubmitting(true);
      try {
        await createTopic(data);
        toast.success("Topic created successfully");
        form.reset();
        onSuccess?.();
      } catch (error) {
        console.error("Error creating topic:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create topic");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter topic name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a description of this topic"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <FormLabel className="text-base">Subtopics</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", description: "" })}
                className="h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Subtopic
              </Button>
            </div>

            <div className="space-y-3">
              {fields.length === 0 && (
                <p className="text-muted-foreground text-sm">No subtopics added yet.</p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1 space-y-3">
                    <FormField
                      control={form.control}
                      name={`subtopics.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Subtopic name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`subtopics.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Subtopic description (optional)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove subtopic</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Topic"}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  const UpdateFormComponent = () => {
    const form = useForm<UpdateTopicInput>({
      resolver: zodResolver(updateTopicSchema),
      defaultValues: {
        teamId,
        id: existingTopic?.id || "",
        name: existingTopic?.name || "",
        description: existingTopic?.description || "",
        category: existingTopic?.category || "",
        subtopics: initialSubtopics,
      },
    });

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "subtopics",
    });

    const onSubmit = async (data: UpdateTopicInput) => {
      setIsSubmitting(true);
      try {
        await updateTopic(data);
        toast.success("Topic updated successfully");
        onSuccess?.();
      } catch (error) {
        console.error("Error updating topic:", error);
        toast.error(error instanceof Error ? error.message : "Failed to update topic");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter topic name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a description of this topic"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <FormLabel className="text-base">Subtopics</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", description: "" })}
                className="h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Subtopic
              </Button>
            </div>

            <div className="space-y-3">
              {fields.length === 0 && (
                <p className="text-muted-foreground text-sm">No subtopics added yet.</p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1 space-y-3">
                    <FormField
                      control={form.control}
                      name={`subtopics.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Subtopic name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`subtopics.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Subtopic description (optional)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove subtopic</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Topic"}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return isEditing ? <UpdateFormComponent /> : <CreateFormComponent />;
}

export default TopicForm;
