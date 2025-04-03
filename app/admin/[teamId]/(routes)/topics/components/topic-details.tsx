"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetDescription, SheetFooter, SheetTitle } from "@/components/ui/sheet";
import type { TopicWithSubtopics } from "@/data/data-access/topic.queries";
import { Book, ChevronRight, Edit, Folder, Trash } from "lucide-react";

interface TopicDetailsProps {
  topic: TopicWithSubtopics;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const TopicDetails = ({ topic, onEdit, onDelete, isDeleting }: TopicDetailsProps) => {
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
        <Button variant="outline" size="sm" className="h-9 px-3 text-sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Topic
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="h-9 px-3 text-sm"
          onClick={onDelete}
          disabled={isDeleting}
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
        <Button className="w-full" onClick={onEdit}>
          Edit Topic
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </SheetFooter>
    </div>
  );
};

export default TopicDetails;
