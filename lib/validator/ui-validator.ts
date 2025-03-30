import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
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
  onboardingDate: z.union([z.string(), z.date()]).transform((val) => {
    if (val instanceof Date) {
      return val.toISOString().split("T")[0];
    }
    // If it's already a string, ensure it's a valid date
    if (!Number.isNaN(Date.parse(val))) {
      return new Date(val).toISOString().split("T")[0];
    }
    throw new Error("Invalid date format");
  }),
  yearsOfExperience: z.coerce.number().min(0, "Years of experience must be at least 0"),
  resumeUrl: z.string().optional(),
  designation: z.string().nullable().optional(),
  assignedAssessorId: z.string().nullable().optional(),
  assignedGroomerId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Types

export type TeamSchemaType = z.infer<typeof TeamSchema>;
export type CandidateSchemaType = z.infer<typeof CandidateSchema>;
