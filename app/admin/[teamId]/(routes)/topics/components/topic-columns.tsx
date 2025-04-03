"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { TopicWithSubtopics } from "@/data/data-access/topic.queries";
import { useMediaQuery } from "@/hooks/general/use-media-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// Subtopics cell component to handle expandable subtopics display
const SubtopicsCell = ({ subtopics }: { subtopics: TopicWithSubtopics["subTopics"] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // If no subtopics, show empty state
  if (!subtopics || subtopics.length === 0) {
    return <div className="text-muted-foreground italic">No subtopics</div>;
  }

  // Default visible count based on screen size
  const initialVisibleCount = isMobile ? 2 : 4;
  const hasMoreSubtopics = subtopics.length > initialVisibleCount;

  // If not expanded, show limited number of subtopics
  const visibleSubtopics = isExpanded ? subtopics : subtopics.slice(0, initialVisibleCount);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {visibleSubtopics.map((subtopic) => (
          <TooltipProvider key={subtopic.id}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className="max-w-[150px] truncate bg-primary/30 text-primary hover:bg-primary/50"
                >
                  {subtopic.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="max-w-[250px]">
                <p className="font-medium text-primary-foreground">{subtopic.name}</p>
                {subtopic.description && (
                  <p className="mt-1 text-primary-foreground/80 text-xs">{subtopic.description}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {hasMoreSubtopics && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex h-6 items-center gap-1 px-2 text-muted-foreground text-xs hover:text-foreground"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Show {subtopics.length - initialVisibleCount} more
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export const useTopicColumns = (): ColumnDef<TopicWithSubtopics>[] => {
  return [
    {
      accessorKey: "name",
      header: "Topic Name",
      cell: ({ row }) => {
        const topic = row.original;
        return <div className="font-medium">{topic.name}</div>;
      },
      enableSorting: true,
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
      enableSorting: true,
    },
    {
      id: "subtopics",
      header: "Subtopics",
      cell: ({ row }) => {
        const topic = row.original;
        return <SubtopicsCell subtopics={topic.subTopics} />;
      },
      enableSorting: false,
    },
    {
      id: "subtopicCount",
      header: "Count",
      cell: ({ row }) => {
        const topic = row.original;
        const count = topic.subTopics?.length || 0;
        return (
          <div className="text-center">
            <Badge variant="outline" className="font-mono">
              {count}
            </Badge>
          </div>
        );
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const countA = rowA.original.subTopics?.length || 0;
        const countB = rowB.original.subTopics?.length || 0;
        return countA - countB;
      },
    },
  ];
};
