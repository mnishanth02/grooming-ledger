import Loader from "@/components/common/loader";
import { getAssociateById } from "@/data/data-access/user.queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AssociateProfile from "./components/associate-profile";

interface PageDetailsProps {
  params: Promise<{
    associateId: string;
    teamId: string;
  }>;
}

async function PageDetails({ params }: PageDetailsProps) {
  const { associateId, teamId } = await params;

  // Fetch the associate data
  const associateData = await getAssociateById(associateId);

  if (!associateData) {
    notFound();
  }

  // The data from getAssociateById is already in the right format for the component
  return (
    <div className="container space-y-4">
      <Suspense fallback={<Loader />}>
        <AssociateProfile associate={associateData} teamId={teamId} />
      </Suspense>
    </div>
  );
}

export default PageDetails;
