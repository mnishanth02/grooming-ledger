import Footer from "@/components/common/footer";
import Loader from "@/components/common/loader";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/sidebar/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAllTeamsByUserId, getTeamAndUser } from "@/data/helper/teams.helper";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface TeamLayoutProps {
  params: Promise<{ teamId: string }>;
  children: React.ReactNode;
}

const TeamLayout = async ({ children, params }: TeamLayoutProps) => {
  const { teamId } = await params;

  // Validate teamId format to prevent unnecessary DB calls
  if (!teamId || typeof teamId !== "string" || teamId.length < 10) {
    redirect("/admin");
  }

  const { team, user } = await getTeamAndUser(teamId);

  // Get all stores for the sidebar
  const allTeams = await getAllTeamsByUserId();

  if (!team) {
    redirect("/admin");
  }

  return (
    <SidebarProvider>
      <Suspense fallback={<Loader className="h-screen" />}>
        <AppSidebar user={user} allTeams={allTeams} currentTeamId={teamId} />
      </Suspense>
      <SidebarInset>
        <Suspense fallback={<Loader />}>
          <Header />
        </Suspense>
        <div className="flex-1">{children}</div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeamLayout;
