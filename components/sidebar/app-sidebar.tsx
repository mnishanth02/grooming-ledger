"use client";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { TeamType } from "@/drizzle/schema/grooming";
import { BarChart, GalleryHorizontalEnd, LayoutDashboard, Settings2, Users } from "lucide-react";
import type { User } from "next-auth";
import type * as React from "react";
import { TeamSwitcher } from "./team-switcher";

const getDashboardNavItems = (teamId: string) => [
  {
    title: "Dashboard",
    url: `/admin/${teamId}`,
    icon: LayoutDashboard,
  },
  {
    title: "Candidates",
    url: `/admin/${teamId}/candidates`,
    icon: Users,
  },
  {
    title: "Assocaites",
    url: `/admin/${teamId}/associates`,
    icon: GalleryHorizontalEnd,
  },

  {
    title: "Reports",
    url: `/admin/${teamId}/reports`,
    icon: BarChart,
  },
  {
    title: "Settings",
    url: `/admin/${teamId}/settings`,
    icon: Settings2,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
  allTeams: TeamType[];
  currentTeamId: string;
}

export function AppSidebar({ user, allTeams, currentTeamId, ...props }: AppSidebarProps) {
  // Format stores for the team switcher
  const formattedTeams = allTeams.map((team) => ({
    name: team.name,
    logo: Users,
    plan: "Team",
    id: team.id,
  }));
  // Get navigation items for the current store
  const navItems = getDashboardNavItems(currentTeamId);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={formattedTeams} activeTeamId={currentTeamId} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
