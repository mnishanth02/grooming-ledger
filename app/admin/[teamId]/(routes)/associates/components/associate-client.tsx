"use client";
import PageHeading from "@/components/common/page-heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import type { UserType } from "@/drizzle/schema/auth";
import type { OptionType } from "@/lib/validator/ui-validator";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import AssociateSheet from "./associate-sheet";
import { type AssociateColumn, columns } from "./columns";

// Extended user type with additional properties needed for associates
interface ExtendedUserType extends UserType {
  candidatesAssignedAsAssessor?: {
    id: string;
    name: string;
    email: string;
    status: string;
  }[];
  candidatesAssignedAsGroomer?: {
    id: string;
    name: string;
    email: string;
    status: string;
  }[];
  skills?: OptionType[];
}

interface AssociateClientProps {
  associates: UserType[] | null;
  fullData: ExtendedUserType[];
}

const AssociateClient = ({ fullData }: AssociateClientProps) => {
  // Sheet state management using nuqs for URL persistence
  const [selectedAssociateId, setSelectedAssociateId] = useQueryState(
    "associateId",
    parseAsString.withDefault(""),
  );

  // Transform full data to the format expected by DataTable (AssociateColumn)
  const tableData = useMemo<AssociateColumn[]>(
    () =>
      fullData.map((associate) => {
        // Get actual counts from the backend data
        const assessorAssignments = associate.candidatesAssignedAsAssessor?.length || 0;
        const groomerAssignments = associate.candidatesAssignedAsGroomer?.length || 0;

        // Format the counts as strings with actual counts
        const assessorAssignmentsText = `${assessorAssignments} Candidate${assessorAssignments !== 1 ? "s" : ""}`;
        const groomerAssignmentsText = `${groomerAssignments} Candidate${groomerAssignments !== 1 ? "s" : ""}`;

        return {
          id: associate.id,
          name: associate.name || "",
          email: associate.email,
          currentAssessorAssigned: assessorAssignmentsText,
          currentGroomerAssigned: groomerAssignmentsText,
          skills: associate.skills?.map((skill) => skill.label) ?? [],
        };
      }),
    [fullData],
  );

  // State to track the selected associate data
  const [selectedAssociateData, setSelectedAssociateData] = useState<AssociateColumn | undefined>(
    undefined,
  );
  const [selectedFullData, setSelectedFullData] = useState<ExtendedUserType | null>(null);

  // Update selected data whenever the ID changes
  useEffect(() => {
    if (!selectedAssociateId) {
      setSelectedAssociateData(undefined);
      setSelectedFullData(null);
      return;
    }

    if (selectedAssociateId === "new") {
      setSelectedAssociateData(undefined);
      setSelectedFullData(null);
      return;
    }

    // Find matching data
    const associateColumn = tableData.find((c) => c.id === selectedAssociateId);
    const associateFullData = fullData.find((c) => c.id === selectedAssociateId);

    // Ensure skills is at least an empty array if undefined
    const processedData = associateFullData
      ? {
          ...associateFullData,
          skills: Array.isArray(associateFullData.skills) ? associateFullData.skills : [],
        }
      : null;

    setSelectedAssociateData(associateColumn);
    setSelectedFullData(processedData);
  }, [selectedAssociateId, fullData, tableData]);

  return (
    <>
      <div className="flex-between">
        <PageHeading
          title={`Associates (${fullData.length})`}
          description="Manage Associates for your team"
        />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={tableData}
        searchKey="name"
        onRowClick={(row: AssociateColumn) => setSelectedAssociateId(row.id)}
      />
      <AssociateSheet
        isOpen={!!selectedAssociateId}
        onClose={() => setSelectedAssociateId("")}
        associate={selectedAssociateData}
        fullData={selectedFullData}
      />
    </>
  );
};

export default AssociateClient;
