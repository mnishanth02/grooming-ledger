import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

// Candidate Schema for validation
export const CandidateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  onboardingDate: z.string(), // Store as ISO string
  teamId: z.string().nullable().optional(),
  yearsOfExperience: z.number().min(0, "Years of experience must be at least 0"),
  resumeUrl: z.string().url("Invalid resume URL"),
  designation: z.string().nullable().optional(),
  assignedAssessorId: z.string().nullable().optional(),
  assignedGroomerId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Types

export type TeamSchemaType = z.infer<typeof TeamSchema>;
export type CandidateSchemaType = z.infer<typeof CandidateSchema>;
