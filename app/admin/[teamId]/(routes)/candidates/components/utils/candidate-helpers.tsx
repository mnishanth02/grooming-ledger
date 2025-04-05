"use client";

import type { CandidateType } from "@/drizzle/schema/grooming";
import type { OptionType } from "@/lib/validator/ui-validator";
import type { CandidateSchemaType } from "@/lib/validator/ui-validator";
import { format } from "date-fns";

/**
 * Extract initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

/**
 * Format date to a readable format
 * @deprecated Using date-fns directly in components instead
 */
export const formatDate = (date: string | Date): string => {
  try {
    return format(new Date(date), "PPP");
  } catch {
    return "Invalid date";
  }
};

/**
 * Get color class for status badge
 */
export const getStatusColor = (status: string): string => {
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

/**
 * Format status text for display
 */
export const formatStatusText = (status: string): string => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Prepare form data for submission
 */
export const prepareSubmitData = (
  data: CandidateSchemaType,
  teamId: string,
): Omit<CandidateSchemaType & { teamId: string }, "candidateId"> => {
  return {
    name: data.name,
    teamId: teamId,
    email: data.email,
    phone: data.phone,
    onboardingDate: data.onboardingDate,
    yearsOfExperience: Number(data.yearsOfExperience),
    resumeUrl: data.resumeUrl,
    designation: data.designation ?? "",
    assignedAssessorId: data.assignedAssessorId,
    assignedGroomerId: data.assignedGroomerId,
    notes: data.notes,
    skills: data.skills,
  };
};

/**
 * Get default form values
 */
export const getDefaultFormValues = (
  candidateData: (CandidateType & { skills?: OptionType[] }) | null,
): CandidateSchemaType => {
  if (!candidateData) {
    return {
      name: "",
      email: "",
      phone: "",
      onboardingDate: "",
      yearsOfExperience: 0,
      resumeUrl: "",
      designation: "",
      assignedAssessorId: "",
      assignedGroomerId: "",
      notes: "",
      skills: [],
    };
  }

  return {
    name: candidateData.name,
    email: candidateData.email,
    phone: candidateData.phone ?? "",
    onboardingDate: candidateData.onboardingDate ?? "",
    resumeUrl: candidateData.resumeUrl ?? "",
    designation: candidateData.designation ?? "",
    yearsOfExperience: candidateData.yearsOfExperience ?? 0,
    assignedAssessorId: candidateData.assignedAssessorId ?? "",
    assignedGroomerId: candidateData.assignedGroomerId ?? "",
    notes: candidateData.notes ?? "",
    skills: candidateData.skills ?? [],
  };
};
