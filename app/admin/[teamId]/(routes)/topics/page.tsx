import TopicsDataTable from "@/components/admin/topics/topic-details";
import PageHeading from "@/components/common/page-heading";
import { getTopicsWithSubtopics } from "@/data/data-access/topic.queries";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

interface TopicsManagementPageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TopicsManagementPage({ params }: TopicsManagementPageProps) {
  const { teamId } = await params;

  // Fetch topics data
  const topics = await getTopicsWithSubtopics();

  return (
    <div className="flex flex-col space-y-4 p-8 pt-6">
      <div>
        <PageHeading
          title="Topics Management"
          description="Manage topic categories for grooming sessions and assessments."
        />
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            <span className="ml-2 text-muted-foreground">Loading topics...</span>
          </div>
        }
      >
        <TopicsDataTable teamId={teamId} initialTopics={topics} />
      </Suspense>
    </div>
  );
}
