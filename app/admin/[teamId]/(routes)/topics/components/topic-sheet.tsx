"use client";

import { InputWithLabel } from "@/components/common/input-with-label";
import { TextareaWithLabel } from "@/components/common/textarea-with-label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createTopic, deleteTopic, updateTopic } from "@/data/actions/topic.actions";
import type { TopicWithSubtopics } from "@/data/data-access/topic.queries";
import {
  type CreateTopicInput,
  type UpdateTopicInput,
  createTopicSchema,
  updateTopicSchema,
} from "@/lib/validator/topic-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, ChevronRight, Edit, Folder, FolderPlus, Plus, Trash, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface TopicSheetProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: TopicWithSubtopics;
}

const TopicSheet = ({ isOpen, onClose, topic }: TopicSheetProps) => {
  const params = useParams();
  const teamId = params.teamId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Handle delete action
  const handleDelete = async () => {
    if (!topic || topic.id === "new") return;

    setIsSubmitting(true);
    try {
      await deleteTopic({ id: topic.id, teamId });
      toast.success("Topic deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete topic");
    } finally {
      setIsSubmitting(false);
      setShowDeleteAlert(false);
    }
  };

  // Create form component
  const CreateForm = () => {
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
        onClose();
      } catch (error) {
        console.error("Error creating topic:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create topic");
      } finally {
        setIsSubmitting(false);
      }
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

          <div>
            <div className="sticky top-0 z-10 mb-3 flex items-center justify-between bg-background pt-1 pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <Book className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium">Subtopics</h3>
              </div>
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

            <div className="relative rounded-lg bg-muted/40 p-4">
              {fields.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">No subtopics added yet.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", description: "" })}
                    className="mt-2 h-8 gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Subtopic
                  </Button>
                </div>
              )}

              {fields.length > 0 && (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-start gap-2 rounded-md bg-muted/70 p-3"
                      >
                        <div className="flex-1 space-y-3">
                          <FormField
                            control={form.control}
                            name={`subtopics.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-medium text-xs">Name</FormLabel>
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
                                <FormLabel className="font-medium text-xs">
                                  Description (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Subtopic description"
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
                          className="mt-6 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove subtopic</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <SheetFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Topic"}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    );
  };

  // Edit form component
  const EditForm = () => {
    // Initialize form based on whether we're editing or creating
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
        id: topic?.id || "",
        name: topic?.name || "",
        description: topic?.description || "",
        category: topic?.category || "",
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
        setViewMode("view");
        onClose();
      } catch (error) {
        console.error("Error updating topic:", error);
        toast.error(error instanceof Error ? error.message : "Failed to update topic");
      } finally {
        setIsSubmitting(false);
      }
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

          <div className="space-y-4 rounded-lg bg-muted/40 p-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          <div>
            <div className="sticky top-0 z-10 mb-3 flex items-center justify-between bg-background pt-1 pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <Book className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium">Subtopics</h3>
              </div>
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

            <div className="relative rounded-lg bg-muted/40 p-4">
              {fields.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">No subtopics added yet.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", description: "" })}
                    className="mt-2 h-8 gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Subtopic
                  </Button>
                </div>
              )}

              {fields.length > 0 && (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-start gap-2 rounded-md bg-muted/70 p-3"
                      >
                        <div className="flex-1 space-y-3">
                          <FormField
                            control={form.control}
                            name={`subtopics.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-medium text-xs">Name</FormLabel>
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
                                <FormLabel className="font-medium text-xs">
                                  Description (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Subtopic description"
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
                          className="mt-6 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove subtopic</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <SheetFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setViewMode("view")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Topic"}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    );
  };

  // Display for view-only mode
  const TopicDetails = () => {
    if (!topic) return null;

    const handleEditClick = () => {
      setViewMode("edit");
    };

    return (
      <div className="space-y-6 pt-2">
        {/* Topic Header with Icon and Badge */}
        <div className="flex flex-col space-y-4">
          {/* Category Badge - Displayed at top if present */}
          {topic.category && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 px-2.5 py-1 font-medium text-xs">
                Category: {topic.category}
              </Badge>
            </div>
          )}

          {/* Topic Name and Icon */}
          <div className="flex items-start justify-center gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-semibold text-xl">{topic.name}</SheetTitle>
              </div>
              {topic.description && (
                <SheetDescription className="mt-1 text-muted-foreground text-sm">
                  {topic.description}
                </SheetDescription>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 text-sm"
            onClick={handleEditClick}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Topic
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-9 px-3 text-sm"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Subtopics Section */}
        {topic.subTopics && topic.subTopics.length > 0 && (
          <div className="space-y-4">
            <div className="sticky top-0 z-10 bg-background pt-1 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <Book className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="flex items-center font-medium text-sm">
                    Subtopics
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted font-medium text-xs">
                      {topic.subTopics.length}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="grid gap-3 pr-4">
                {topic.subTopics.map((subtopic, index) => (
                  <div
                    key={subtopic.id}
                    className="rounded-lg border-primary/30 border-l-2 bg-muted/50 p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-medium text-xs">
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-sm">{subtopic.name}</h4>
                    </div>
                    {subtopic.description && (
                      <p className="mt-2 pl-8 text-muted-foreground text-sm">
                        {subtopic.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Footer Button */}
        <SheetFooter className="mt-6">
          <Button className="w-full" onClick={handleEditClick}>
            Edit Topic
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </SheetFooter>
      </div>
    );
  };

  // Main render function
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full max-w-md overflow-y-auto px-3 sm:max-w-lg">
          <SheetHeader className="">
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

          {isNewTopic && <CreateForm />}
          {!isNewTopic && viewMode === "edit" && topic && <EditForm />}
          {!isNewTopic && viewMode === "view" && topic && <TopicDetails />}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this topic?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the topic and all
              associated subtopics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TopicSheet;
