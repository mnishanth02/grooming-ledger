import Loader from "@/components/common/loader";
import { getAllUsersByTeamId } from "@/data/data-access/auth.queries";
import { getAllCandidatesByTeamIdQuery } from "@/data/data-access/candidate.queries";
import type { OptionType } from "@/lib/validator/ui-validator";
import { Suspense } from "react";
import CandidateClient from "./components/candidate-client";

export const dynamic = "force-dynamic";

interface CandidatePageProps {
  params: Promise<{ teamId: string }>;
}

const CandidatePage = async ({ params }: CandidatePageProps) => {
  const { teamId } = await params;

  // Fetch both candidates and associates data
  const [candidatesData, associatesData] = await Promise.all([
    getAllCandidatesByTeamIdQuery(teamId),
    getAllUsersByTeamId(teamId),
  ]);

  const associates = associatesData.success
    ? associatesData.data?.filter((user) => user.role === "ASSOCIATE") || []
    : [];

  // Transform the full candidate data to include skills in the expected OptionType format
  const transformedFullData = candidatesData.success
    ? (candidatesData.data ?? []).map((candidate) => ({
        ...candidate,
        skills:
          candidate.skills?.map(
            (cs): OptionType => ({
              value: cs.skill.id,
              label: cs.skill.name,
              category: cs.skill.category ?? undefined,
            }),
          ) ?? [],
      }))
    : [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <CandidateClient associates={associates} fullData={transformedFullData} />
        </Suspense>
      </div>
    </div>
  );
};

export default CandidatePage;
