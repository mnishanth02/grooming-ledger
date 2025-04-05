"use client";

import PageHeading from "@/components/common/page-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { OptionType } from "@/lib/validator/ui-validator";
import {
  ArrowUpRight,
  Building,
  CalendarClock,
  ChevronLeft,
  Edit,
  Mail,
  Medal,
  Phone,
  UserRound,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CandidateList from "./candidate-list";

// Simplified interface focusing only on what we need
interface ExtendedUserType {
  id?: string;
  name?: string | null;
  email?: string;
  image?: string | null;
  role?: string;
  phoneNumber?: string | null;
  department?: string | null;
  designation?: string | null;
  employeeId?: string | null;
  createdAt?: Date | string | null;
  teamId?: string | null;
  candidatesAssignedAsAssessor?: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
  }>;
  candidatesAssignedAsGroomer?: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
  }>;
  skills?: OptionType[];
}

interface AssociateProfileProps {
  associate: ExtendedUserType;
  teamId: string;
}

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "N/A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default function AssociateProfile({ associate, teamId }: AssociateProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("assessor");

  // Format data for display
  const assessorCandidatesCount = associate.candidatesAssignedAsAssessor?.length || 0;
  const groomerCandidatesCount = associate.candidatesAssignedAsGroomer?.length || 0;

  return (
    <div className="space-y-4 px-4">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="w-fit cursor-pointer p-0 transition-colors hover:border hover:bg-background"
          onClick={() => router.push(`/admin/${teamId}/associates`)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          <span className="font-medium text-sm">Back to Associates</span>
        </Button>

        <div className="flex flex-col justify-between gap-4 px-4 md:flex-row md:items-center">
          <PageHeading title={associate.name || "Associate"} description={associate.email || ""} />

          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="transition-all hover:scale-105 hover:border-primary hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Associate</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
        {/* Profile Card */}
        <Card className="border shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>Associate details and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 transition-transform hover:scale-105">
                {associate.image ? (
                  <AvatarImage src={associate.image} alt={associate.name || ""} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-xl">
                    {getInitials(associate.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium text-lg">{associate.name}</h3>
                <Badge className="fade-in-50 mt-1 animate-in">{associate.role}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary/70" />
                <span className="text-sm">{associate.email}</span>
              </div>

              {associate.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary/70" />
                  <span className="text-sm">{associate.phoneNumber}</span>
                </div>
              )}

              {associate.department && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary/70" />
                  <span className="text-sm">{associate.department}</span>
                </div>
              )}

              {associate.designation && (
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary/70" />
                  <span className="text-sm">{associate.designation}</span>
                </div>
              )}

              {associate.employeeId && (
                <div className="flex items-center gap-2">
                  <Medal className="h-4 w-4 text-primary/70" />
                  <span className="text-sm">Employee ID: {associate.employeeId}</span>
                </div>
              )}

              {associate.createdAt && (
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary/70" />
                  <span className="text-sm">
                    Joined: {new Date(associate.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-5 md:col-span-2">
          {/* Assignment Summary Card */}
          <Card className="border shadow-sm transition-shadow duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Assignment Summary</CardTitle>
              <CardDescription>Current candidate assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab("assessor")}
                    className="flex w-full items-center justify-between rounded-md p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary/70" />
                      <span className="text-muted-foreground">As Assessor:</span>
                    </div>
                    <Badge
                      className={`${activeTab === "assessor" ? "bg-primary" : ""} transition-colors`}
                    >
                      {assessorCandidatesCount} Candidates
                    </Badge>
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab("groomer")}
                    className="flex w-full items-center justify-between rounded-md p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary/70" />
                      <span className="text-muted-foreground">As Groomer:</span>
                    </div>
                    <Badge
                      className={`${activeTab === "groomer" ? "bg-primary" : ""} transition-colors`}
                    >
                      {groomerCandidatesCount} Candidates
                    </Badge>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="border shadow-sm transition-shadow duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Skills</CardTitle>
              <CardDescription>Technical skills and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {associate.skills && associate.skills.length > 0 ? (
                  associate.skills.map((skill) => (
                    <HoverCard key={skill.value}>
                      <HoverCardTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer transition-all hover:scale-105 hover:bg-secondary/80"
                        >
                          {skill.label}
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-sm">{skill.label}</h4>
                            <p className="text-muted-foreground text-sm">
                              Associates with this skill can be assigned to related candidates
                            </p>
                            <div className="flex items-center pt-2">
                              <span className="text-muted-foreground text-xs">View more</span>
                              <ArrowUpRight className="ml-1 h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No skills registered</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Candidates Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger
                value="assessor"
                className="cursor-pointer transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                As Assessor ({assessorCandidatesCount})
              </TabsTrigger>
              <TabsTrigger
                value="groomer"
                className="cursor-pointer transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                As Groomer ({groomerCandidatesCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="assessor">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Candidates Assigned as Assessor</CardTitle>
                  <CardDescription>Candidates being assessed by this associate</CardDescription>
                </CardHeader>
                <CardContent>
                  <CandidateList candidates={associate.candidatesAssignedAsAssessor || []} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="groomer">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Candidates Assigned as Groomer</CardTitle>
                  <CardDescription>Candidates being groomed by this associate</CardDescription>
                </CardHeader>
                <CardContent>
                  <CandidateList candidates={associate.candidatesAssignedAsGroomer || []} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
