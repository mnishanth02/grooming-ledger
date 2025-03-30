import Loader from "@/components/common/loader";
import { getAllCandidatesByTeamIdQuery } from "@/data/data-access/candidate.queries";
import { Suspense } from "react";
import CandidateClient from "./components/client";
import type { CandidateColumn } from "./components/columns";

interface CandidatePageProps {
  params: Promise<{ teamId: string }>;
}

const CandidatePage = async ({ params }: CandidatePageProps) => {
  const { teamId } = await params;
  const candidates = await getAllCandidatesByTeamIdQuery(teamId);

  const formattedCandidates: CandidateColumn[] = candidates.success
    ? (candidates.data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        email: item.email,
        groomer: item.assignedGroomerId ?? "",
        assessor: item.assignedAssessorId ?? "",
        onboardingDate: item.onboardingDate,
      }))
    : [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <CandidateClient data={formattedCandidates.length > 0 ? formattedCandidates : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default CandidatePage;
