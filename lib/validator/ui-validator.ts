import { parseDateToUTC } from "@/lib/utils/date";
import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

// Define the option schema for skills
export const OptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  category: z.string().optional(),
  disable: z.boolean().optional(),
  fixed: z.boolean().optional(),
});

// Candidate Schema for validation
export const CandidateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  email: z
    .string()
    .nonempty("Please enter your email")
    .email({ message: "Invalid email format" })
    .refine((email) => email.endsWith("@pwc.com"), {
      message: "Only PwC email addresses are allowed",
    }),
  phone: z.string().min(1, "Phone is required"),
  onboardingDate: z.union([z.string(), z.date()]).refine(
    (val) => {
      if (val instanceof Date) {
        return parseDateToUTC(val.toISOString());
      }
      // If it's already a string, ensure it's a valid date
      if (!Number.isNaN(Date.parse(val))) {
        return parseDateToUTC(val);
      }
      return false;
    },
    {
      message: "Invalid date format",
    },
  ),
  yearsOfExperience: z.coerce.number().min(0, "Years of experience must be at least 0"),
  resumeUrl: z.string().optional(),
  designation: z.string().nullable().optional(),
  assignedAssessorId: z.string(),
  assignedGroomerId: z.string(),
  notes: z.string().nullable().optional(),
  // Add skills field as an array of options
  skills: z.array(OptionSchema).optional().default([]),
});

// Types

export type TeamSchemaType = z.infer<typeof TeamSchema>;
export type CandidateSchemaType = z.infer<typeof CandidateSchema>;
export type OptionType = z.infer<typeof OptionSchema>;
