"use client";

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@ui/breadcrumb";
import { BreadcrumbSeparator } from "@ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import * as React from "react";

interface BreadcrumbSegment {
  title: string;
  url: string;
  isLast: boolean;
}

// This map will help us translate URL segments to display titles
// We can easily add new routes here without changing the core logic
const ROUTE_TITLES: Record<string, string> = {
  // Main routes
  candidates: "Candidates",
  associates: "Associates",
  reports: "Reports",
  settings: "Settings",
  analytics: "Analytics",

  // Sub-routes
};

export const BreadCrumTitle = () => {
  const pathname = usePathname();

  // Generate breadcrumb segments
  const breadcrumbSegments = useMemo<BreadcrumbSegment[]>(() => {
    if (!pathname) return [];

    // Split the pathname by '/'
    const segments = pathname.split("/").filter(Boolean);

    // If we only have the teamId, we're on the Overview page
    if (segments.length === 2) {
      return [{ title: "Overview", url: `/admin/${segments[1]}`, isLast: true }];
    }

    // Create an array to hold our breadcrumb segments
    const breadcrumbs: BreadcrumbSegment[] = [];
    const teamId = segments[1];

    // Process each segment after the storeId
    for (let i = 2; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;

      // Build the URL up to this segment
      let url = `/admin/${teamId}`;
      for (let j = 2; j <= i; j++) {
        url += `/${segments[j]}`;
      }

      // Get the title from our map or capitalize the segment
      const title = ROUTE_TITLES[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      breadcrumbs.push({ title, url, isLast });
    }

    return breadcrumbs;
  }, [pathname]);

  return (
    <>
      {breadcrumbSegments.map((segment) => (
        <React.Fragment key={segment.url}>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            {segment.isLast ? (
              <BreadcrumbPage>{segment.title}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={segment.url}>{segment.title}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </>
  );
};
