"use client";
import Loader from "@/components/common/loader";
import PageHeading from "@/components/common/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import type { TopicWithSubtopics, getTopicsWithSubtopics } from "@/data/data-access/topic.queries";
import { useMediaQuery } from "@/hooks/general/use-media-query";
import { Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useTopicColumns } from "./topic-columns";
import TopicSheet from "./topic-sheet";

interface TopicClientProps {
  data: Awaited<ReturnType<typeof getTopicsWithSubtopics>>;
  teamId: string;
}

const TopicClient = ({ data, teamId }: TopicClientProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(true);

  const columns = useTopicColumns();

  const [selectedTopicId, setSelectedTopicId] = useQueryState(
    "topicId",
    parseAsString.withDefault(""),
  );

  // Find the selected topic or create a new mock topic for "new" mode
  const selectedTopic = useMemo(() => {
    if (selectedTopicId === "new") {
      return {
        id: "new",
        name: "",
        description: null,
        category: null,
        teamId: teamId,
        updatedAt: new Date(),
        subTopics: [],
      } as TopicWithSubtopics;
    }
    return data.find((topic) => topic.id === selectedTopicId);
  }, [selectedTopicId, data, teamId]);

  // Clear selection when data changes (e.g., after a delete)
  useEffect(() => {
    if (
      selectedTopicId &&
      selectedTopicId !== "new" &&
      !data.some((topic) => topic.id === selectedTopicId)
    ) {
      setSelectedTopicId("");
    }
  }, [data, selectedTopicId, setSelectedTopicId]);

  // Simulate data loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeading
          title="Topics Management"
          description="Manage topic and subtopics for grooming and assessment sessions."
        />
        <Button size={isMobile ? "icon" : "default"} onClick={() => setSelectedTopicId("new")}>
          {isMobile ? (
            <Plus className="h-4 w-4" />
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </>
          )}
        </Button>
      </div>
      <Separator className="my-4" />

      {isLoading ? (
        <Card className="w-full p-6">
          <CardContent className="flex items-center justify-center pt-6 pb-8">
            <Loader />
          </CardContent>
        </Card>
      ) : (
        <Suspense fallback={<Loader />}>
          <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            onRowClick={(row) => setSelectedTopicId(row.id)}
          />
        </Suspense>
      )}

      <TopicSheet
        isOpen={!!selectedTopicId}
        onClose={() => setSelectedTopicId("")}
        topic={selectedTopic}
      />
    </>
  );
};

export default TopicClient;
