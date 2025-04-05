"use client";
import PageHeading from "@/components/common/page-heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import type { UserType } from "@/drizzle/schema/auth";
import type { CandidateType } from "@/drizzle/schema/grooming";
import { useMediaQuery } from "@/hooks/general/use-media-query";
import type { OptionType } from "@/lib/validator/ui-validator";
import { Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { CandidateSheet } from "./candidate-sheet";
import { type CandidateColumn, columns } from "./columns";

interface CandidateClientProps {
  associates: UserType[] | null;
  fullData: (CandidateType & { skills?: OptionType[] })[];
}

const CandidateClient = ({ associates, fullData }: CandidateClientProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Sheet state management using nuqs for URL persistence
  const [selectedCandidateId, setSelectedCandidateId] = useQueryState(
    "candidateId",
    parseAsString.withDefault(""),
  );

  // Transform full data to the format expected by DataTable (CandidateColumn)
  const tableData = useMemo<CandidateColumn[]>(
    () =>
      fullData.map((candidate) => {
        // Find the groomer and assessor names from associates
        const groomerName = candidate.assignedGroomerId
          ? associates?.find((a) => a.id === candidate.assignedGroomerId)?.name || ""
          : "";
        const assessorName = candidate.assignedAssessorId
          ? associates?.find((a) => a.id === candidate.assignedAssessorId)?.name || ""
          : "";

        return {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          status: candidate.status,
          groomer: groomerName,
          assessor: assessorName,
          onboardingDate: candidate.onboardingDate ?? "",
          skills: candidate.skills?.map((skill) => skill.label) ?? [],
        };
      }),
    [fullData, associates],
  );

  // State to track the selected candidate data
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateColumn | undefined>(
    undefined,
  );
  const [selectedFullData, setSelectedFullData] = useState<
    (CandidateType & { skills?: OptionType[] }) | null
  >(null);
  const [isNewCandidate, setIsNewCandidate] = useState(false);

  // Update selected data whenever the ID changes
  useEffect(() => {
    if (!selectedCandidateId) {
      setSelectedCandidate(undefined);
      setSelectedFullData(null);
      setIsNewCandidate(false);
      return;
    }

    if (selectedCandidateId === "new") {
      setSelectedCandidate(undefined);
      setSelectedFullData(null);
      setIsNewCandidate(true);
      return;
    }

    // Find matching data
    const candidateColumn = tableData.find((c) => c.id === selectedCandidateId);
    const candidateFullData = fullData.find((c) => c.id === selectedCandidateId);

    // Ensure skills is at least an empty array if undefined
    const processedData = candidateFullData
      ? {
          ...candidateFullData,
          skills: Array.isArray(candidateFullData.skills) ? candidateFullData.skills : [],
        }
      : null;

    setSelectedCandidate(candidateColumn);
    setSelectedFullData(processedData);
    setIsNewCandidate(false);
  }, [selectedCandidateId, fullData, tableData]);

  return (
    <>
      <div className="flex-between">
        <PageHeading
          title={`Candidates (${fullData.length})`}
          description="Manage Candidates for your team"
        />
        <Button size={isMobile ? "icon" : "default"} onClick={() => setSelectedCandidateId("new")}>
          {isMobile ? <Plus className="h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {!isMobile && "Add New"}
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={tableData}
        searchKey="name"
        onRowClick={(row: CandidateColumn) => setSelectedCandidateId(row.id)}
      />
      <CandidateSheet
        isOpen={!!selectedCandidateId}
        onClose={() => setSelectedCandidateId("")}
        candidate={selectedCandidate}
        associates={associates}
        fullData={selectedFullData}
        isNewCandidate={isNewCandidate}
      />
    </>
  );
};

export default CandidateClient;
