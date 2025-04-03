"use client";

import { InputWithLabel } from "@/components/common/input-with-label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CreateTopicInput, UpdateTopicInput } from "@/lib/validator/topic-validator";
import { Book, Plus, X } from "lucide-react";
import { type Control, useFieldArray } from "react-hook-form";

// Type that can accommodate both of our form types
export type TopicFormType = CreateTopicInput | UpdateTopicInput;

interface SubtopicFormSectionProps {
  control: Control<TopicFormType>;
  name: "subtopics";
}

const SubtopicFormSection = ({ control, name }: SubtopicFormSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
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
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 rounded-md bg-muted/70 p-3">
                  <div className="flex-1 space-y-3">
                    <InputWithLabel
                      fieldTitle="Subtopic Name"
                      nameInSchema={`${name}.${index}.name` as never}
                      placeholder="Enter subtopic name"
                    />

                    <InputWithLabel
                      fieldTitle="Subtopic Description (Optional)"
                      nameInSchema={`${name}.${index}.description` as never}
                      placeholder="Enter subtopic description"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-6 h-8 w-8 cursor-pointer"
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
  );
};

export default SubtopicFormSection;
