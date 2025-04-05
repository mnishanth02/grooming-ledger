"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";

export type CandidateColumn = {
  id: string;
  name: string;
  email: string;
  status: string;
  groomer: string;
  assessor: string;
  onboardingDate: string;
  skills: string[];
};

export const columns: ColumnDef<CandidateColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "groomer",
    header: "Groomer",
  },
  {
    accessorKey: "assessor",
    header: "Assessor",
  },
  {
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => {
      const skills = row.getValue("skills") as string[];
      const maxVisible = 2;
      const visibleSkills = skills.slice(0, maxVisible);
      const remainingCount = skills.length - maxVisible;

      return (
        <div className="flex max-w-[200px] flex-wrap gap-1">
          {visibleSkills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="cursor-pointer text-xs">
                  +{remainingCount} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  {skills.slice(maxVisible).map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "onboardingDate",
    header: "Onboarding Date",
  },
];
