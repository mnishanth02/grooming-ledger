"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Mail, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { memo } from "react";
import type { CandidateColumn } from "./columns";
import { formatStatusText, getInitials, getStatusColor } from "./utils/candidate-helpers";

interface CandidateSheetHeaderProps {
  viewMode: "view" | "edit";
  candidate?: CandidateColumn;
  isNewCandidate: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onViewFullProfile: () => void;
}

const CandidateSheetHeader = memo(function CandidateSheetHeader({
  viewMode,
  candidate,
  isNewCandidate,
  onEdit,
  onDelete,
  onViewFullProfile,
}: CandidateSheetHeaderProps) {
  // If in view mode and have candidate data
  if (viewMode === "view" && candidate) {
    return (
      <SheetHeader className="relative space-y-1 pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <SheetTitle className="font-semibold text-xl">{candidate.name}</SheetTitle>
            <SheetDescription className="flex items-center text-muted-foreground text-sm">
              <Mail className="mr-1 h-4 w-4" />
              {candidate.email}
            </SheetDescription>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Badge
            className={`rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(candidate.status)}`}
          >
            {formatStatusText(candidate.status)}
          </Badge>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onEdit}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewFullProfile}>View full profile</DropdownMenuItem>
                <DropdownMenuItem>Send email</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetHeader>
    );
  }

  // If in edit mode or no candidate data
  return (
    <SheetHeader className="relative space-y-1 pb-4">
      <SheetTitle className="font-semibold text-xl">
        {isNewCandidate ? "Create New Candidate" : "Edit Candidate"}
      </SheetTitle>
    </SheetHeader>
  );
});

export default CandidateSheetHeader;
