import Loader from "@/components/common/loader";
import { getAllUsersByTeamId } from "@/data/data-access/auth.queries";
import { getCandidateByIdQuery } from "@/data/data-access/candidate.queries";
import { Suspense } from "react";
import CandidateForm from "./components/candidate-form";

interface CandidateDetailsPageProps {
  params: Promise<{ candidateId: string; teamId: string }>;
}

const CandidateDetailsPage = async ({ params }: CandidateDetailsPageProps) => {
  const { candidateId, teamId } = await params;

  const [candidateData, associatesData] = await Promise.all([
    getCandidateByIdQuery(candidateId),
    getAllUsersByTeamId(teamId),
  ]);

  const candidate = candidateData.success && candidateData.data ? candidateData.data : null;

  const associates =
    associatesData.success && associatesData.data
      ? associatesData.data.filter((user) => user.role === "ASSOCIATE")
      : [];

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CandidateForm associates={associates} initialData={candidate} />
      </div>
    </Suspense>
  );
};

export default CandidateDetailsPage;
