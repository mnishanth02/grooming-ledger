import { validateSpecificTeam } from "@/data/helper/teams.helper";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: Promise<{ teamId: string }>;
}

const TeamDashboardPage = async ({ params }: DashboardPageProps) => {
  const { teamId } = await params;

  const team = await validateSpecificTeam(teamId);

  if (!team) {
    redirect("/admin");
  }

  return (
    <div>
      <div className="flex-1 space-y-4 p-8 pt-6">Team Name - {team.name}</div>
    </div>
  );
};

export default TeamDashboardPage;
