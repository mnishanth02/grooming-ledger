import "server-only";

import { lower } from "@/data/helper/db-helper";
import db from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { candidates } from "@/drizzle/schema/grooming";
import type { ApiResponse } from "@/types/api";
import { and, eq, isNull, like, or } from "drizzle-orm";
import type { CandidateWithAssessorAndGroomer } from "./candidate.queries";

export type SearchItem = {
  id: string;
  name: string;
  email: string;
  role?: string;
  type: "candidate" | "associate";
};

// ******************************************************
// *******************  searchUsersQuery ****************
// ******************************************************
export async function searchUsersQuery(
  searchQuery: string,
  teamId?: string,
): Promise<ApiResponse<SearchItem[]>> {
  try {
    const queryLike = `%${searchQuery.toLowerCase()}%`;

    const usersData = await db
      .select()
      .from(users)
      .where(
        and(
          teamId ? eq(users.teamId, teamId) : undefined,
          isNull(users.deletedAt),
          or(like(lower(users.name), queryLike), like(lower(users.email), queryLike)),
        ),
      );

    if (!usersData || usersData.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // Transform user data to search items
    const searchItems = usersData.map((user) => ({
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
      role: user.role ?? undefined,
      type: "associate" as const,
    }));

    return {
      success: true,
      data: searchItems,
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
// ***************** searchCandidatesQuery **************
// ******************************************************
export async function searchCandidatesQuery(
  searchQuery: string,
  teamId?: string,
): Promise<ApiResponse<SearchItem[]>> {
  try {
    const queryLike = `%${searchQuery.toLowerCase()}%`;

    const candidatesData = await db.query.candidates.findMany({
      where: and(
        teamId ? eq(candidates.teamId, teamId) : undefined,
        isNull(candidates.deletedAt),
        or(like(lower(candidates.name), queryLike), like(lower(candidates.email), queryLike)),
      ),
      with: {
        assignedAssessor: true,
        assignedGroomer: true,
      },
    });

    if (!candidatesData || candidatesData.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // Transform candidate data to search items
    const searchItems = candidatesData.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      type: "candidate" as const,
    }));

    return {
      success: true,
      data: searchItems,
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
// ****************** searchPeopleQuery *****************
// ******************************************************
export async function searchPeopleQuery(
  searchQuery: string,
  teamId?: string,
): Promise<ApiResponse<SearchItem[]>> {
  try {
    const [usersResponse, candidatesResponse] = await Promise.all([
      searchUsersQuery(searchQuery, teamId),
      searchCandidatesQuery(searchQuery, teamId),
    ]);

    const combinedData: SearchItem[] = [];

    if (usersResponse.success && usersResponse.data) {
      combinedData.push(...usersResponse.data);
    }

    if (candidatesResponse.success && candidatesResponse.data) {
      combinedData.push(...candidatesResponse.data);
    }

    return {
      success: true,
      data: combinedData,
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
// ************** Helper mapping functions **************
// ******************************************************

/**
 * Map a candidate to a search item
 */
export function mapCandidateToSearchItem(candidate: CandidateWithAssessorAndGroomer): SearchItem {
  return {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    type: "candidate",
  };
}

/**
 * Map a user (associate) to a search item
 */
export function mapUserToSearchItem(user: typeof users.$inferSelect): SearchItem {
  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role ?? undefined,
    type: "associate",
  };
}
