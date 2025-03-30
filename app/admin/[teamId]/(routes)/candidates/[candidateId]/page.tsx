import Loader from "@/components/common/loader";
import { getCandidateByIdQuery } from "@/data/data-access/candidate.queries";
import { Suspense } from "react";
import CandidateForm from "./components/candidate-form";

interface CandidateDetailsPageProps {
  params: Promise<{ candidateId: string; teamId: string }>;
}

const CandidateDetailsPage = async ({ params }: CandidateDetailsPageProps) => {
  const { candidateId } = await params;

  const candidate = await getCandidateByIdQuery(candidateId);

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CandidateForm initialData={candidate?.success && candidate.data ? candidate.data : null} />
      </div>
    </Suspense>
  );
};

export default CandidateDetailsPage;
