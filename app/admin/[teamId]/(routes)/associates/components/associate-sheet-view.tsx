"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserType } from "@/drizzle/schema/auth";
import type { OptionType } from "@/lib/validator/ui-validator";
import { ChevronRight } from "lucide-react";
import type { AssociateColumn } from "./columns";

// Extended user type with additional properties
interface ExtendedUserType extends UserType {
  candidatesAssignedAsAssessor?: {
    id: string;
    name: string;
    email: string;
    status: string;
  }[];
  candidatesAssignedAsGroomer?: {
    id: string;
    name: string;
    email: string;
    status: string;
  }[];
  skills?: OptionType[];
}

interface AssociateSheetViewProps {
  associate: AssociateColumn;
  fullData?: ExtendedUserType | null;
  onViewFullProfile: () => void;
}

const AssociateSheetView = ({
  associate,
  fullData,
  onViewFullProfile,
}: AssociateSheetViewProps) => {
  // Get the actual assigned candidates
  const assessorCandidates = fullData?.candidatesAssignedAsAssessor || [];
  const groomerCandidates = fullData?.candidatesAssignedAsGroomer || [];

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Assignment Summary</CardTitle>
          <CardDescription>Current candidate assignments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">As Assessor:</span>
            <span className="font-medium">{associate.currentAssessorAssigned}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">As Groomer:</span>
            <span className="font-medium">{associate.currentGroomerAssigned}</span>
          </div>
        </CardContent>
      </Card>

      {/* Assessor Candidates Section (if any) */}
      {assessorCandidates.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium text-lg">Assigned as Assessor for</h3>
          <Separator className="mb-4" />
          <div className="space-y-2">
            {assessorCandidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between">
                <span>{candidate.name}</span>
                <Badge variant="outline">{candidate.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Groomer Candidates Section (if any) */}
      {groomerCandidates.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium text-lg">Assigned as Groomer for</h3>
          <Separator className="mb-4" />
          <div className="space-y-2">
            {groomerCandidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between">
                <span>{candidate.name}</span>
                <Badge variant="outline">{candidate.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      <div>
        <h3 className="mb-2 font-medium text-lg">Skills</h3>
        <Separator className="mb-4" />
        <div className="flex flex-wrap gap-2">
          {associate.skills && associate.skills.length > 0 ? (
            associate.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No skills registered</p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {fullData && (
        <div>
          <h3 className="mb-2 font-medium text-lg">Additional Information</h3>
          <Separator className="mb-4" />
          <div className="space-y-2">
            {fullData.designation && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Designation:</span>
                <span className="font-medium">{fullData.designation}</span>
              </div>
            )}
            {fullData.department && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{fullData.department}</span>
              </div>
            )}
            {fullData.employeeId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee ID:</span>
                <span className="font-medium">{fullData.employeeId}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Full Profile Button */}
      <Button onClick={onViewFullProfile} variant="outline" className="w-full">
        View Full Profile
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default AssociateSheetView;
