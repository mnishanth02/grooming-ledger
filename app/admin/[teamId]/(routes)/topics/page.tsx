import Loader from "@/components/common/loader";
import { getTopicsWithSubtopics } from "@/data/data-access/topic.queries";
import { Suspense } from "react";
import TopicClient from "./components/topic-client";

interface TopicsManagementPageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TopicsManagementPage({ params }: TopicsManagementPageProps) {
  const { teamId } = await params;

  const topics = await getTopicsWithSubtopics(teamId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <TopicClient teamId={teamId} data={topics} />
        </Suspense>
      </div>
    </div>
  );
}
