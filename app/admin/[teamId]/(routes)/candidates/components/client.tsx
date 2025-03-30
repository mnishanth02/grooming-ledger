"use client";
import PageHeading from "@/components/common/page-heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/general/use-media-query";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { type CandidateColumn, columns } from "./columns";

interface CandidateClientProps {
  data: CandidateColumn[];
}

const CandidateClient = ({ data }: CandidateClientProps) => {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <div className="flex-between">
        <PageHeading
          title={`Candidates (${data.length})`}
          description="Manage Candidates for your team"
        />
        <Button
          size={isMobile ? "icon" : "default"}
          onClick={() => router.push(`/admin/${params.teamId}/candidates/new`)}
        >
          {isMobile ? <Plus className="h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {!isMobile && "Add New"}
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};

export default CandidateClient;
