import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type CandidateWithAssessorAndGroomer,
  getAllCandidatesByTeamIdQuery,
} from "@/data/data-access/candidate.queries";
import { Suspense } from "react";
import { RecentActivitiesClient } from "./recent-activities-client";

interface RecentActivitiesProps {
  teamId: string;
}

// Server component that fetches data
const RecentActivities = async ({ teamId }: RecentActivitiesProps) => {
  // Fetch candidates data on the server
  const candidatesResponse = await getAllCandidatesByTeamIdQuery(teamId);
  const candidates =
    candidatesResponse.success && candidatesResponse.data ? candidatesResponse.data : [];

  // Sort candidates by most recently updated
  const sortedCandidates = [...candidates].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  // Generate activities from sorted candidates
  const activityData = generateActivitiesFromCandidates(sortedCandidates.slice(0, 10));

  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">Loading activities...</p>
            </div>
          </CardContent>
        </Card>
      }
    >
      <RecentActivitiesClient activities={activityData} />
    </Suspense>
  );
};

// Helper function to generate activities from candidates
function generateActivitiesFromCandidates(candidates: CandidateWithAssessorAndGroomer[]) {
  return candidates.map((candidate) => {
    // Determine activity type and description based on status
    let type: "STATUS_CHANGE" | "ASSESSMENT" | "GROOMING" | "ASSIGNMENT" = "STATUS_CHANGE";
    let description = `Status updated to ${candidate.status}`;

    if (candidate.status.includes("ASSESSMENT")) {
      type = "ASSESSMENT";
      description = candidate.status.includes("FAILED")
        ? "Failed assessment"
        : candidate.status.includes("PASSED")
          ? "Passed assessment"
          : "Assessment status updated";
    } else if (candidate.status.includes("GROOMING")) {
      type = "GROOMING";
      description =
        candidate.status === "GROOMING_COMPLETED"
          ? "Completed grooming"
          : "Started grooming process";
    } else if (candidate.assignedAssessorId || candidate.assignedGroomerId) {
      type = "ASSIGNMENT";
      const assignedTo: string[] = [];
      if (candidate.assignedAssessor) assignedTo.push("Assessor");
      if (candidate.assignedGroomer) assignedTo.push("Groomer");
      description = `Assigned to ${assignedTo.join(" and ")}`;
    }

    return {
      id: `${candidate.id}-${Date.now()}`,
      type,
      candidateName: candidate.name,
      candidateImage: null, // Placeholder as we don't have images in the schema
      description,
      date: new Date(candidate.updatedAt),
      status: candidate.status,
      associateName: candidate.assignedGroomer?.name || candidate.assignedAssessor?.name,
    };
  });
}

export default RecentActivities;
