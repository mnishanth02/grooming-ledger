import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamType } from "@/drizzle/schema/grooming";
import { CalendarRange, Users } from "lucide-react";

interface DashboardHeaderProps {
  team: TeamType;
}

const DashboardHeader = ({ team }: DashboardHeaderProps) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-col gap-2 p-0 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="font-bold text-2xl tracking-tight">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {team.name} Dashboard
            </div>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {team.description || "Manage candidates, associates, and grooming progress."}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <CalendarRange className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button size="sm" className="h-9">
            Add Candidate
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default DashboardHeader;
