import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCandidateByIdQuery } from "@/data/data-access/candidate.queries";
import { format } from "date-fns";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Code,
  FileText,
  Mail,
  Phone,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface CandidateProfilePageProps {
  params: Promise<{ candidateId: string; teamId: string }>;
}

const CandidateProfilePage = async ({ params }: CandidateProfilePageProps) => {
  const { candidateId, teamId } = await params;

  const candidateData = await getCandidateByIdQuery(candidateId);
  const candidate = candidateData.success && candidateData.data ? candidateData.data : null;

  if (!candidate) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <h1 className="mb-2 font-bold text-2xl">Candidate Not Found</h1>
        <p className="mb-4 text-muted-foreground">
          The candidate you're looking for doesn't exist or has been removed.
        </p>
        <Link href={`/admin/${teamId}/candidates`}>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Button>
        </Link>
      </div>
    );
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Custom loading skeleton for candidate profile sections
  const ProfileSectionSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/admin/${teamId}/candidates`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-bold text-2xl">Candidate Profile</h1>
        </div>
        {/* <Link href={ `/admin/${teamId}/candidates/${candidateId}` }>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Candidate
          </Button>
        </Link> */}
      </div>

      <Separator />

      <Suspense fallback={<ProfileSectionSkeleton />}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-xl">{candidate.name}</h2>

              <div className="space-y-4">
                <Badge className="mb-2">{formatStatus(candidate.status)}</Badge>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.email}</span>
                </div>

                {candidate.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.designation || "No designation specified"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.yearsOfExperience || 0} years of experience</span>
                </div>
              </div>
            </div>

            {/* Team Assignment */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Team Assignment</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <UserCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Assessor</p>
                    <p className="text-muted-foreground text-sm">
                      {candidate.assignedAssessorId ? "Assigned" : "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <UserCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Groomer</p>
                    <p className="text-muted-foreground text-sm">
                      {candidate.assignedGroomerId ? "Assigned" : "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Skills and Onboarding */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Skills & Technologies</h2>

              {candidate.skills && candidate.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge
                      key={skill.value}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Code className="h-3 w-3" />
                      {skill.label}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No skills specified</p>
              )}
            </div>

            {/* Onboarding Details */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Onboarding Details</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Onboarding Date</p>
                    <p className="text-muted-foreground text-sm">
                      {format(new Date(candidate.onboardingDate), "PPP")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Resources</h2>

              <div className="space-y-2">
                {candidate.resumeUrl ? (
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary text-sm hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    View Resume
                  </a>
                ) : (
                  <p className="text-muted-foreground text-sm">No resume provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Notes */}
          <div className="h-fit rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Notes</h2>

            {candidate.notes ? (
              <div className="whitespace-pre-wrap text-sm">{candidate.notes}</div>
            ) : (
              <p className="text-muted-foreground text-sm">No notes available</p>
            )}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default CandidateProfilePage;
