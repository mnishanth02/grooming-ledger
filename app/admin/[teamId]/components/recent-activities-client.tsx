"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ArrowRight, Calendar, Clock, RefreshCw, User } from "lucide-react";
import { useRouter } from "next/navigation";

type ActivityType = {
  id: string;
  type: "STATUS_CHANGE" | "ASSESSMENT" | "GROOMING" | "ASSIGNMENT";
  candidateName: string;
  candidateImage?: string | null;
  description: string;
  date: Date;
  status?: string;
  associateName?: string;
};

type StatusBadgeVariant = "default" | "destructive" | "outline" | "secondary";

interface RecentActivitiesClientProps {
  activities: ActivityType[];
}

export const RecentActivitiesClient = ({ activities }: RecentActivitiesClientProps) => {
  const router = useRouter();

  // Helper to refresh the activities by triggering a server revalidation
  const refreshActivities = () => {
    router.refresh();
  };

  // Helper to get status badge variant based on activity type and status
  const getStatusVariant = (type: ActivityType["type"], status?: string): StatusBadgeVariant => {
    if (type === "ASSESSMENT") {
      return status?.includes("FAILED") ? "destructive" : "default";
    }
    if (type === "GROOMING") {
      return "secondary";
    }
    if (type === "ASSIGNMENT") {
      return "outline";
    }

    // For status changes
    if (status?.includes("PLACED")) return "default";
    if (status?.includes("FAILED") || status?.includes("TERMINATED")) return "destructive";
    return "secondary";
  };

  // Helper to get icon based on activity type
  const getActivityIcon = (type: ActivityType["type"]) => {
    switch (type) {
      case "ASSESSMENT":
        return <User className="h-4 w-4" />;
      case "GROOMING":
        return <Clock className="h-4 w-4" />;
      case "ASSIGNMENT":
        return <Calendar className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates on candidates and grooming sessions</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="h-8" onClick={refreshActivities}>
          <RefreshCw className="mr-2 h-3 w-3" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-4">
          {activities.length > 0 ? (
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={activity.candidateImage || undefined}
                        alt={activity.candidateName}
                      />
                      <AvatarFallback>
                        {activity.candidateName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="-bottom-0.5 -right-1 absolute rounded-full bg-background p-0.5">
                      <div className="rounded-full bg-primary p-1">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.candidateName}</p>
                      <Badge variant={getStatusVariant(activity.type, activity.status)}>
                        {activity.status || "Updated"}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {activity.description}
                      {activity.associateName && ` (${activity.associateName})`}
                    </p>

                    <div className="flex items-center pt-2">
                      <time className="text-muted-foreground text-xs">
                        {format(new Date(activity.date), "PPP")}
                      </time>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <Button variant="link" size="sm" className="gap-1 text-muted-foreground text-xs">
                  View all activities
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
