"use client";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BarChart, GalleryHorizontalEnd, LayoutDashboard, Settings2, Users } from "lucide-react";
import type { User } from "next-auth";
import type * as React from "react";

const getDashboardNavItems = () => [
  {
    title: "Overview",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Candidates",
    url: "/admin/candidates",
    icon: Users,
  },
  {
    title: "Assocaites",
    url: "/admin/associates",
    icon: GalleryHorizontalEnd,
  },

  {
    title: "Reports",
    url: "/admin/reports",
    icon: BarChart,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings2,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Format stores for the team switcher

  // Get navigation items for the current store
  const navItems = getDashboardNavItems();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <activeStore.logo className="size-4" /> */}
                <span>PwC</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Grooming Hub</span>
                <span className="truncate text-xs">Captive</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
