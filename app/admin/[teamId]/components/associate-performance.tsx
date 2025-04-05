"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CandidateWithAssessorAndGroomer } from "@/data/data-access/candidate.queries";
import { useEffect, useState } from "react";

interface AssociatePerformanceProps {
  candidates: CandidateWithAssessorAndGroomer[];
  teamId?: string; // Make it optional since we don't use it directly but it might be needed later
}

type AssociateMetric = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  candidateCount: number;
  successRate: number;
};

const AssociatePerformance = ({ candidates }: AssociatePerformanceProps) => {
  const [groomers, setGroomers] = useState<AssociateMetric[]>([]);
  const [assessors, setAssessors] = useState<AssociateMetric[]>([]);
  const [activeTab, setActiveTab] = useState<string>("groomers");

  useEffect(() => {
    // Process associate data from candidates
    const groomerMap = new Map<string, AssociateMetric>();
    const assessorMap = new Map<string, AssociateMetric>();

    for (const candidate of candidates) {
      // Process groomer data
      if (candidate.assignedGroomerId && candidate.assignedGroomer) {
        const groomerId = candidate.assignedGroomerId;

        if (!groomerMap.has(groomerId)) {
          groomerMap.set(groomerId, {
            id: groomerId,
            name: candidate.assignedGroomer.name || "Unknown",
            email: candidate.assignedGroomer.email,
            image: candidate.assignedGroomer.image,
            role: "Groomer",
            candidateCount: 0,
            successRate: 0,
          });
        }

        const groomerData = groomerMap.get(groomerId);
        if (groomerData) {
          groomerData.candidateCount++;

          // Consider success if candidate has completed grooming or beyond
          if (
            candidate.status === "GROOMING_COMPLETED" ||
            candidate.status === "POST_ASSESSMENT_PENDING" ||
            candidate.status === "POST_ASSESSMENT_COMPLETED" ||
            candidate.status === "CLIENT_INTERVIEW_SCHEDULED" ||
            candidate.status === "PLACED"
          ) {
            groomerData.successRate = Math.round(
              (groomerData.successRate * (groomerData.candidateCount - 1) + 100) /
                groomerData.candidateCount,
            );
          } else {
            groomerData.successRate = Math.round(
              (groomerData.successRate * (groomerData.candidateCount - 1)) /
                groomerData.candidateCount,
            );
          }
        }
      }

      // Process assessor data
      if (candidate.assignedAssessorId && candidate.assignedAssessor) {
        const assessorId = candidate.assignedAssessorId;

        if (!assessorMap.has(assessorId)) {
          assessorMap.set(assessorId, {
            id: assessorId,
            name: candidate.assignedAssessor.name || "Unknown",
            email: candidate.assignedAssessor.email,
            image: candidate.assignedAssessor.image,
            role: "Assessor",
            candidateCount: 0,
            successRate: 0,
          });
        }

        const assessorData = assessorMap.get(assessorId);
        if (assessorData) {
          assessorData.candidateCount++;

          // Consider success if candidate passed assessment
          if (
            candidate.status === "ASSESSMENT_PASSED" ||
            candidate.status === "GROOMING_IN_PROGRESS" ||
            candidate.status === "GROOMING_COMPLETED" ||
            candidate.status === "POST_ASSESSMENT_PENDING" ||
            candidate.status === "POST_ASSESSMENT_COMPLETED" ||
            candidate.status === "CLIENT_INTERVIEW_SCHEDULED" ||
            candidate.status === "PLACED"
          ) {
            assessorData.successRate = Math.round(
              (assessorData.successRate * (assessorData.candidateCount - 1) + 100) /
                assessorData.candidateCount,
            );
          } else if (candidate.status === "ASSESSMENT_FAILED") {
            assessorData.successRate = Math.round(
              (assessorData.successRate * (assessorData.candidateCount - 1)) /
                assessorData.candidateCount,
            );
          }
        }
      }
    }

    setGroomers(
      Array.from(groomerMap.values()).sort((a, b) => b.candidateCount - a.candidateCount),
    );
    setAssessors(
      Array.from(assessorMap.values()).sort((a, b) => b.candidateCount - a.candidateCount),
    );
  }, [candidates]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Associate Performance</CardTitle>
        <CardDescription>Track the performance of groomers and assessors</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="groomers" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="groomers">Groomers</TabsTrigger>
            <TabsTrigger value="assessors">Assessors</TabsTrigger>
          </TabsList>

          <TabsContent value="groomers" className="space-y-4">
            {groomers.length > 0 ? (
              groomers.slice(0, 5).map((groomer) => (
                <div key={groomer.id} className="flex items-center justify-between space-y-1">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={groomer.image || undefined} alt={groomer.name} />
                      <AvatarFallback>{groomer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{groomer.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {groomer.candidateCount} candidates
                      </Badge>
                    </div>
                  </div>
                  <div className="w-1/3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs">{groomer.successRate}%</span>
                    </div>
                    <Progress value={groomer.successRate} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">No groomer data available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="assessors" className="space-y-4">
            {assessors.length > 0 ? (
              assessors.slice(0, 5).map((assessor) => (
                <div key={assessor.id} className="flex items-center justify-between space-y-1">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={assessor.image || undefined} alt={assessor.name} />
                      <AvatarFallback>{assessor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{assessor.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {assessor.candidateCount} candidates
                      </Badge>
                    </div>
                  </div>
                  <div className="w-1/3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs">{assessor.successRate}%</span>
                    </div>
                    <Progress value={assessor.successRate} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">No assessor data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssociatePerformance;
