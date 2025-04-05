import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CandidateWithAssessorAndGroomer } from "@/data/data-access/candidate.queries";
import { ArrowUpRight, CheckCircle, Clock, UserCheck, Users } from "lucide-react";

interface DashboardStatsProps {
  candidates: CandidateWithAssessorAndGroomer[];
}

const DashboardStats = ({ candidates }: DashboardStatsProps) => {
  // Calculate statistics based on candidate data
  const totalCandidates = candidates.length;

  const inGroomingCount = candidates.filter((c) => c.status === "GROOMING_IN_PROGRESS").length;

  const completedGroomingCount = candidates.filter(
    (c) =>
      c.status === "GROOMING_COMPLETED" ||
      c.status === "POST_ASSESSMENT_PENDING" ||
      c.status === "POST_ASSESSMENT_COMPLETED" ||
      c.status === "CLIENT_INTERVIEW_SCHEDULED" ||
      c.status === "PLACED",
  ).length;

  const placedCandidates = candidates.filter((c) => c.status === "PLACED").length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{totalCandidates}</div>
          <p className="text-muted-foreground text-xs">In this team</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">In Grooming</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{inGroomingCount}</div>
          <p className="text-muted-foreground text-xs">
            {Math.round((inGroomingCount / totalCandidates) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Completed Grooming</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{completedGroomingCount}</div>
          <p className="text-muted-foreground text-xs">
            {Math.round((completedGroomingCount / totalCandidates) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Placed Candidates</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{placedCandidates}</div>
          <p className="flex items-center gap-1 text-muted-foreground text-xs">
            <ArrowUpRight className="h-3 w-3 text-green-500" />
            {Math.round((placedCandidates / totalCandidates) * 100) || 0}% success rate
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardStats;
