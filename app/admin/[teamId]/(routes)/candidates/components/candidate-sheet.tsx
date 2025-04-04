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
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { CalendarDays, ChevronRight, Mail, MoreHorizontal, Pencil, UserCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { CandidateColumn } from "./columns";

interface CandidateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: CandidateColumn;
}

export function CandidateSheet({ isOpen, onClose, candidate }: CandidateSheetProps) {
  const router = useRouter();
  const params = useParams();

  if (!candidate) return null;

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Format status color based on value
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-primary/10 text-primary border-primary/20";
      case "pre_assessment_pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "pre_assessment_completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "assessment_passed":
        return "bg-green-50 text-green-700 border-green-200";
      case "assessment_failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "grooming_in_progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "grooming_completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "post_assessment_pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "post_assessment_completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "client_interview_scheduled":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "client_interview_failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "re_grooming_scheduled":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "placed":
        return "bg-green-50 text-green-700 border-green-200";
      case "terminated":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "in progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-muted-foreground/20";
    }
  };

  const handleEdit = () => {
    router.push(`/admin/${params.teamId}/candidates/${candidate.id}`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto border-l sm:max-w-lg">
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
              {candidate.status}
            </Badge>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={handleEdit}>
                <Pencil className="mr-1 h-3.5 w-3.5" />
                Edit
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View full profile</DropdownMenuItem>
                  <DropdownMenuItem>Send email</DropdownMenuItem>
                  <DropdownMenuItem>Download details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        <div className="space-y-6 px-3 pt-2">
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-3 font-medium text-sm">Team Members</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <UserCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Groomer</div>
                  <div className="text-muted-foreground text-sm">{candidate.groomer}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <UserCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Assessor</div>
                  <div className="text-muted-foreground text-sm">{candidate.assessor}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-3 font-medium text-sm">Onboarding Details</h3>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Onboarding Date</div>
                <div className="text-muted-foreground text-sm">
                  {format(new Date(candidate.onboardingDate), "PPP")}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-3 font-medium text-sm">Candidate Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email Candidate
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button className="w-full" size="sm" onClick={handleEdit}>
            Edit Candidate
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
