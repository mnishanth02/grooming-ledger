"use server";

import { candidateStatusEnum } from "@/drizzle/schema/enums";
import type { candidates } from "@/drizzle/schema/grooming";
import { ActionError } from "@/lib/error";
import { teamActionClient } from "@/lib/utils/safe-action";
import { CandidateSchema } from "@/lib/validator/ui-validator";
import { z } from "zod";
import {
  createCandidateQuery,
  deleteCandidateQuery,
  getCandidateByIdQuery,
  updateCandidateQuery,
} from "../data-access/candidate.queries";

// Create candidate action
export const createCandidate = teamActionClient
  .metadata({
    actionName: "createCandidate",
    requiresAuth: true,
  })
  .schema(CandidateSchema)
  .action(async ({ parsedInput }) => {
    // Convert Date to ISO string
    const candidateData = {
      ...parsedInput,
      onboardingDate: new Date(parsedInput.onboardingDate).toISOString(),
    };

    const result = await createCandidateQuery(candidateData);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create candidate");
    }

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
    z.object({
      candidateId: z.string().min(1, "Candidate ID is required"),
      name: z.string().min(1).max(255).optional(),
      email: z.string().email().optional(),
      onboardingDate: z.string().optional(),
      status: z.enum(candidateStatusEnum.enumValues).optional(),
      teamId: z.string().nullable().optional(),
      designation: z.string().nullable().optional(),
      department: z.string().nullable().optional(),
      employeeId: z.string().nullable().optional(),
      assignedAssessorId: z.string().nullable().optional(),
      assignedGroomerId: z.string().nullable().optional(),
      clientInterviewQuestions: z.string().nullable().optional(),
      placementDetails: z.string().nullable().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { candidateId, onboardingDate, ...rest } = parsedInput;

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
