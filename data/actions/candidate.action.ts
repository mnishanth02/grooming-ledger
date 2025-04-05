"use server";
import type { candidates } from "@/drizzle/schema/grooming";
import { ActionError } from "@/lib/error";
import { teamActionClient } from "@/lib/utils/safe-action";
import { CandidateSchema } from "@/lib/validator/ui-validator";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createCandidateQuery,
  deleteCandidateQuery,
  getCandidateByIdQuery,
  updateCandidateQuery,
  updateCandidateSkillsQuery,
} from "../data-access/candidate.queries";

// Create candidate action
export const createCandidate = teamActionClient
  .metadata({
    actionName: "createCandidate",
    requiresAuth: true,
  })
  .schema(
    CandidateSchema.extend({
      teamId: z.string().min(1, "Team is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    // Extract skills from input
    const { skills, teamId, ...candidateInput } = parsedInput;

    // Convert Date to ISO string
    const candidateData = {
      ...candidateInput,
      teamId,
      onboardingDate: new Date(candidateInput.onboardingDate).toISOString(),
    };

    const result = await createCandidateQuery(candidateData);

    if (!result.success) {
      if (result.error?.message.includes("candidate_email_unique")) {
        throw new ActionError("Candidate already exists");
      }
      throw new ActionError(result.error?.message || "Failed to create candidate");
    }

    // If we have skills, add them
    if (skills && skills.length > 0 && result.data) {
      const skillIds = skills.map((skill) => skill.value);
      const skillsResult = await updateCandidateSkillsQuery(result.data.id, skillIds);

      if (!skillsResult.success) {
        // Log error but don't fail the whole operation
        console.error("Failed to add candidate skills:", skillsResult.error);
      }
    }

    // Revalidate the candidates page
    revalidatePath(`/admin/${teamId}/candidates`);

    return {
      candidate: result.data,
      message: "Candidate created successfully",
    };
  });

// Update candidate action
export const updateCandidate = teamActionClient
  .metadata({
    actionName: "updateCandidate",
    requiresAuth: true,
  })
  .schema(
    CandidateSchema.extend({
      candidateId: z.string().min(1, "Candidate ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { candidateId, onboardingDate, skills, ...rest } = parsedInput;

    // Verify candidate exists
    const candidateCheck = await getCandidateByIdQuery(candidateId);
    if (!candidateCheck.success) {
      throw new ActionError("Candidate not found");
    }

    // Prepare update data
    const updateData: Partial<typeof candidates.$inferInsert> = {
      ...rest,
      ...(onboardingDate && { onboardingDate: new Date(onboardingDate).toISOString() }),
    };

    const result = await updateCandidateQuery(candidateId, updateData);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to update candidate");
    }

    // Update skills if provided
    if (skills) {
      const skillIds = skills.map((skill) => skill.value);
      const skillsResult = await updateCandidateSkillsQuery(candidateId, skillIds);

      if (!skillsResult.success) {
        // Log error but don't fail the whole operation
        console.error("Failed to update candidate skills:", skillsResult.error);
      }
    }

    return {
      candidate: result.data,
      message: "Candidate updated successfully",
    };
  });

// Delete candidate action
export const deleteCandidate = teamActionClient
  .metadata({
    actionName: "deleteCandidate",
    requiresAuth: true,
  })
  .schema(
    z.object({
      candidateId: z.string().min(1, "Candidate ID is required"),
      teamId: z.string().min(1, "Team ID is required"),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { candidateId } = parsedInput;

    // Verify candidate exists
    const candidateCheck = await getCandidateByIdQuery(candidateId);
    if (!candidateCheck.success) {
      throw new ActionError("Candidate not found");
    }

    const result = await deleteCandidateQuery(candidateId);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to delete candidate");
    }

    return {
      candidate: result.data,
      message: "Candidate deleted successfully",
    };
  });
