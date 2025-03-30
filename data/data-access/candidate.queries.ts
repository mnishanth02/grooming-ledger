import "server-only";

import db from "@/drizzle/db";
import type { users } from "@/drizzle/schema";
import { candidates } from "@/drizzle/schema/grooming";
import type { ApiResponse } from "@/types/api";
import { and, eq, isNull } from "drizzle-orm";

// ******************************************************
// *******************  createCandidateQuery ****************
// ******************************************************
export async function createCandidateQuery(
  data: typeof candidates.$inferInsert,
): Promise<ApiResponse<typeof candidates.$inferSelect>> {
  try {
    const candidate = await db
      .insert(candidates)
      .values(data)
      .returning()
      .then((res) => res[0] ?? null);

    if (candidate) {
      return {
        success: true,
        data: candidate,
        message: "Candidate created successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Candidate creation failed",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  updateCandidateQuery ****************
// ******************************************************
export async function updateCandidateQuery(
  candidateId: string,
  data: Partial<typeof candidates.$inferInsert>,
): Promise<ApiResponse<typeof candidates.$inferSelect>> {
  try {
    const updatedCandidate = await db
      .update(candidates)
      .set(data)
      .where(and(eq(candidates.id, candidateId), isNull(candidates.deletedAt)))
      .returning()
      .then((res) => res[0] ?? null);

    if (updatedCandidate) {
      return {
        success: true,
        data: updatedCandidate,
        message: "Candidate updated successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Candidate not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  deleteCandidateQuery ****************
// ******************************************************
export async function deleteCandidateQuery(
  candidateId: string,
): Promise<ApiResponse<typeof candidates.$inferSelect>> {
  try {
    const deletedCandidate = await db
      .update(candidates)
      .set({ deletedAt: new Date() })
      .where(eq(candidates.id, candidateId))
      .returning()
      .then((res) => res[0] ?? null);

    if (deletedCandidate) {
      return {
        success: true,
        data: deletedCandidate,
        message: "Candidate deleted successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Candidate not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  getCandidateByIdQuery ****************
// ******************************************************
export async function getCandidateByIdQuery(
  candidateId: string,
): Promise<ApiResponse<typeof candidates.$inferSelect>> {
  try {
    const candidate = await db
      .select()
      .from(candidates)
      .where(and(eq(candidates.id, candidateId), isNull(candidates.deletedAt)))
      .then((res) => res[0] ?? null);

    if (candidate) {
      return {
        success: true,
        data: candidate,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Candidate not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  getAllCandidatesByTeamIdQuery ****************
// ******************************************************

export type CandidateWithAssessorAndGroomer = typeof candidates.$inferSelect & {
  assignedAssessor: typeof users.$inferSelect;
  assignedGroomer: typeof users.$inferSelect;
};

export async function getAllCandidatesByTeamIdQuery(
  teamId: string,
): Promise<ApiResponse<CandidateWithAssessorAndGroomer[]>> {
  try {
    const allCandidates = await db.query.candidates.findMany({
      where: and(eq(candidates.teamId, teamId), isNull(candidates.deletedAt)),
      with: {
        assignedAssessor: true,
        assignedGroomer: true,
      },
    });

    if (allCandidates && allCandidates.length > 0) {
      return {
        success: true,
        data: allCandidates,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No candidates found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  getAllCandidatesByGroomerIdQuery ****************
// ******************************************************
export async function getAllCandidatesByGroomerIdQuery(
  groomerId: string,
): Promise<ApiResponse<(typeof candidates.$inferSelect)[]>> {
  try {
    const allCandidates = await db
      .select()
      .from(candidates)
      .where(and(eq(candidates.assignedGroomerId, groomerId), isNull(candidates.deletedAt)));

    if (allCandidates && allCandidates.length > 0) {
      return {
        success: true,
        data: allCandidates,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No candidates found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  getAllCandidatesByAssessorIdQuery ****************
// ******************************************************
export async function getAllCandidatesByAssessorIdQuery(
  assessorId: string,
): Promise<ApiResponse<(typeof candidates.$inferSelect)[]>> {
  try {
    const allCandidates = await db
      .select()
      .from(candidates)
      .where(and(eq(candidates.assignedAssessorId, assessorId), isNull(candidates.deletedAt)));

    if (allCandidates && allCandidates.length > 0) {
      return {
        success: true,
        data: allCandidates,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No candidates found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
