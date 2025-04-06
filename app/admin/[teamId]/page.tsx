import { getAllCandidatesByTeamIdQuery } from "@/data/data-access/candidate.queries";
import { validateSpecificTeam } from "@/data/helper/teams.helper";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AssociatePerformance from "./components/associate-performance";
import CandidateStatusOverview from "./components/candidate-status-overview";
import DashboardHeader from "./components/dashboard-header";
import DashboardStats from "./components/dashboard-stats";
import RecentActivities from "./components/recent-activities";

interface DashboardPageProps {
  params: Promise<{ teamId: string }>;
}

// Loading fallback for dashboard sections
const SectionSkeleton = () => <div className="h-40 w-full animate-pulse rounded-lg bg-muted" />;

const TeamDashboardPage = async ({ params }: DashboardPageProps) => {
  const { teamId } = await params;

  const team = await validateSpecificTeam(teamId);

  if (!team) {
    redirect("/admin");
  }

  // Fetch candidates data for the team on the server
  const candidatesResponse = await getAllCandidatesByTeamIdQuery(teamId);
  const candidates =
    candidatesResponse.success && candidatesResponse.data ? candidatesResponse.data : [];

  return (
    <div className="flex flex-col gap-4 px-8">
      <DashboardHeader team={team} />

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <SectionSkeleton />
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStats candidates={candidates} />
        </div>
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<SectionSkeleton />}>
          <CandidateStatusOverview candidates={candidates} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AssociatePerformance candidates={candidates} />
        </Suspense>
      </div>

      <Suspense fallback={<SectionSkeleton />}>
        <RecentActivities teamId={teamId} />
      </Suspense>
    </div>
  );
};

export default TeamDashboardPage;
