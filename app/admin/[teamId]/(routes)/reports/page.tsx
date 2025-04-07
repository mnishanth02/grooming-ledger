import ReportsClient from "@/app/admin/[teamId]/(routes)/reports/components/reports-client";
import { getAllCandidatesByTeamIdQuery } from "@/data/data-access/candidate.queries";
import { Suspense } from "react";

interface ReportsPageProps {
  params: Promise<{ teamId: string }>;
}

const ReportsPage = async ({ params }: ReportsPageProps) => {
  const { teamId } = await params;

  // Fetch all candidates for this team
  const candidatesResponse = await getAllCandidatesByTeamIdQuery(teamId);
  const candidates =
    candidatesResponse.success && candidatesResponse.data ? candidatesResponse.data : [];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate customized reports for candidates and export the data.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-10 w-1/4 animate-pulse rounded-lg bg-muted" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
            <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
          </div>
        }
      >
        <ReportsClient candidates={candidates} teamId={teamId} />
      </Suspense>
    </div>
  );
};

export default ReportsPage;
