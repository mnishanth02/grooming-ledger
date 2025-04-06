import PageHeading from "@/components/common/page-heading";
import { Separator } from "@/components/ui/separator";
import { getTeamAndUser } from "@/data/helper/teams.helper";
import { Suspense } from "react";
import { SettingsForm } from "./components/settings-form";

export const metadata = {
  title: "Settings",
  description: "Manage your team settings and preferences",
};

interface SettingsPageProps {
  params: Promise<{
    teamId: string;
  }>;
}

async function SettingsPage({ params }: SettingsPageProps) {
  const { teamId } = await params;
  const { team, user } = await getTeamAndUser(teamId);

  if (!team) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-6 px-6 ">
      <PageHeading title="Settings" description="Manage your team settings and preferences" />
      <Separator />
      <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-muted" />}>
        <SettingsForm team={team} user={user} />
      </Suspense>
    </div>
  );
}

export default SettingsPage;
