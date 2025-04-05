import Loader from "@/components/common/loader";
import { getAllUsersByTeamId } from "@/data/data-access/auth.queries";
import type { OptionType } from "@/lib/validator/ui-validator";
import { Suspense } from "react";
import AssociateClient from "./components/associate-client";

export const dynamic = "force-dynamic";

// // Extended user type with additional properties needed for associates
// interface ExtendedUserType extends UserType {
//   candidatesAssignedAsAssessor?: {
//     id: string;
//     name: string;
//     email: string;
//     status: string;
//   }[];
//   candidatesAssignedAsGroomer?: {
//     id: string;
//     name: string;
//     email: string;
//     status: string;
//   }[];
//   associateSkills?: {
//     id: string;
//     associateId: string;
//     skillId: string;
//     proficiencyLevel?: number;
//     skill: {
//       id: string;
//       name: string;
//     };
//   }[];
//   skills?: OptionType[];
// }

interface AssociatePageProps {
  params: Promise<{ teamId: string }>;
}

const AssociatePage = async ({ params }: AssociatePageProps) => {
  const { teamId } = await params;

  // Fetch all users by team ID
  const associatesData = await getAllUsersByTeamId(teamId);

  // Filter for only associates
  const associates = associatesData.success
    ? associatesData.data?.filter((user) => user.role === "ASSOCIATE") || []
    : [];
  // Transform the associates data for display
  const transformedAssociates = associates.map((associate) => {
    const assessorAssignments = (associate.candidatesAssignedAsAssessor || []).map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      status: candidate.status,
    }));
    const groomerAssignments = (associate.candidatesAssignedAsGroomer || []).map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      status: candidate.status,
    }));

    // Create a skills array from the associate's skills
    const skills: OptionType[] = [];

    // Map skills from the database if they exist
    if (associate.associateSkills && associate.associateSkills.length > 0) {
      for (const skillData of associate.associateSkills) {
        if (skillData.skill) {
          skills.push({
            value: skillData.skill.id,
            label: skillData.skill.name,
          });
        }
      }
    } else {
      // TODO: Fallback to placeholder skills if no skills found in database
      // This can be removed once skills are properly populated in the database
      if (associate.name?.includes("a") || associate.name?.includes("A")) {
        skills.push({ value: "react", label: "React" });
      }
      if (associate.name?.includes("e") || associate.name?.includes("E")) {
        skills.push({ value: "typescript", label: "TypeScript" });
      }
      if (associate.name?.includes("i") || associate.name?.includes("I")) {
        skills.push({ value: "node", label: "Node.js" });
      }
    }

    return {
      ...associate,
      candidatesAssignedAsAssessor: assessorAssignments,
      candidatesAssignedAsGroomer: groomerAssignments,
      skills,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <AssociateClient associates={associates} fullData={transformedAssociates} />
        </Suspense>
      </div>
    </div>
  );
};

export default AssociatePage;
