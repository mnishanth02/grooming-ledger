"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import type { CandidateType } from "@/drizzle/schema/grooming";
import type { OptionType } from "@/lib/validator/ui-validator";
import { format } from "date-fns";
import {
  Briefcase,
  CalendarDays,
  Code,
  Eye,
  FileText,
  Mail,
  Pencil,
  UserCheck,
} from "lucide-react";
import { memo } from "react";
import type { CandidateColumn } from "./columns";

interface CandidateSheetViewProps {
  candidate: CandidateColumn;
  fullData: CandidateType & { skills?: OptionType[] };
  onEdit: () => void;
  onViewFullProfile: () => void;
}

const CandidateSheetView = memo(function CandidateSheetView({
  candidate,
  fullData,
  onEdit,
  onViewFullProfile,
}: CandidateSheetViewProps) {
  return (
    <>
      <div className="space-y-6 pt-4">
        {/* Team Members Section */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="mb-3 font-medium text-sm">Team Members</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Groomer</div>
                <div className="text-muted-foreground text-sm">
                  {candidate.groomer || "Not assigned"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Assessor</div>
                <div className="text-muted-foreground text-sm">
                  {candidate.assessor || "Not assigned"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="mb-3 font-medium text-sm">Professional Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Designation</div>
                <div className="text-muted-foreground text-sm">
                  {fullData.designation || "Not specified"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1.5">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Experience</div>
                <div className="text-muted-foreground text-sm">
                  {fullData.yearsOfExperience || 0} years
                </div>
              </div>
            </div>
            {fullData.resumeUrl && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Resume</div>
                  <a
                    href={fullData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills/Technologies Section */}
        {fullData.skills && fullData.skills.length > 0 && (
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-3 font-medium text-sm">Technologies & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {fullData.skills.map((skill: OptionType) => (
                <Badge
                  key={skill.label}
                  className="border-none bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <Code className="mr-1 h-3.5 w-3.5" />
                  {skill.label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Onboarding Details */}
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

        {/* Notes Section - Only show if there are notes */}
        {fullData.notes && (
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-3 font-medium text-sm">Notes</h3>
            <p className="whitespace-pre-wrap text-muted-foreground text-sm">{fullData.notes}</p>
          </div>
        )}

        {/* Candidate Actions */}
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

      <SheetFooter className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          className="w-full sm:flex-1"
          size="sm"
          onClick={onViewFullProfile}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Full Profile
        </Button>
        <Button className="w-full bg-primary sm:flex-1" size="sm" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Candidate
        </Button>
      </SheetFooter>
    </>
  );
});

export default CandidateSheetView;
