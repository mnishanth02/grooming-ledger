import "server-only";

import db from "@/drizzle/db";
import { teams } from "@/drizzle/schema/grooming";
import type { ApiResponse } from "@/types/api";
import { and, eq, isNull } from "drizzle-orm";

// ******************************************************
// *******************  createTeamQuery ****************
// ******************************************************
export async function createTeamQuery(
  data: typeof teams.$inferInsert,
): Promise<ApiResponse<typeof teams.$inferSelect>> {
  try {
    const team = await db
      .insert(teams)
      .values(data)
      .returning()
      .then((res) => res[0] ?? null);

    if (team) {
      return {
        success: true,
        data: team,
        message: "Team created successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Store creation failed",
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
// *******************  updateTeamQuery ****************
// ******************************************************
export async function updateTeamQuery(
  teamId: string,
  data: typeof teams.$inferInsert,
): Promise<ApiResponse<typeof teams.$inferSelect>> {
  try {
    const updatedTeam = await db
      .update(teams)
      .set(data)
      .where(and(eq(teams.id, teamId), isNull(teams.deletedAt)))
      .returning()
      .then((res) => res[0] ?? null);

    if (updatedTeam) {
      return {
        success: true,
        data: updatedTeam,
        message: "Team updated successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Team not found",
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
// *******************  deleteTeamQuery ****************
// ******************************************************
export async function deleteTeamQuery(
  teamId: string,
): Promise<ApiResponse<typeof teams.$inferSelect>> {
  try {
    // Validate inputs with Zod
    const deletedTeam = await db
      .update(teams)
      .set({ deletedAt: new Date() })
      .where(eq(teams.id, teamId))
      .returning()
      .then((res) => res[0] ?? null);

    if (deletedTeam) {
      return {
        success: true,
        data: deletedTeam,
        message: "Team deleted successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Team not found",
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
// *******************  getTeamByIdQuery ****************
// ******************************************************
export async function getTeamByIdQuery(
  teamId: string,
  userId: string,
): Promise<ApiResponse<typeof teams.$inferSelect>> {
  try {
    const team = await db.query.teams.findFirst({
      where: and(eq(teams.id, teamId), eq(teams.userId, userId), isNull(teams.deletedAt)),
    });

    if (team) {
      return {
        success: true,
        data: team,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Team not found",
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
// *******************  getTeamByUserIdQuery ****************
// ******************************************************
export async function getTeamByUserIdQuery(
  userId: string,
): Promise<ApiResponse<typeof teams.$inferSelect>> {
  try {
    const team = await db.query.teams.findFirst({
      where: and(eq(teams.userId, userId), isNull(teams.deletedAt)),
    });

    if (team) {
      return {
        success: true,
        data: team,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Team not found",
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
// *******************  getAllTeamByUserIdQuery ****************
// ******************************************************
export async function getAllTeamByUserIdQuery(
  userId: string,
): Promise<ApiResponse<(typeof teams.$inferSelect)[]>> {
  try {
    const allTeams = await db.query.teams.findMany({
      where: and(eq(teams.userId, userId), isNull(teams.deletedAt)),
    });

    if (allTeams && allTeams.length > 0) {
      return {
        success: true,
        data: allTeams,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No teams found",
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
