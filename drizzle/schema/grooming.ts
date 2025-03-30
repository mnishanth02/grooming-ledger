import { relations } from "drizzle-orm";
import { date, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { users } from "./auth";
import { candidateStatusEnum } from "./enums";

export const teams = pgTable(
  "team",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    userId: text("user_id").references(() => users.id),
    deletedAt: timestamp("deleted_at", { mode: "date" }), // For soft delete
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("team_name_idx").on(table.name)],
);

// Simplified candidate table focused on grooming lifecycle tracking
export const candidates = pgTable(
  "candidate",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    yearsOfExperience: integer("years_of_experience"),
    resumeUrl: text("resume_url"),
    linkedinUrl: text("linkedin_url"),
    githubUrl: text("github_url"),
    portfolioUrl: text("portfolio_url"),
    onboardingDate: date("onboarding_date").notNull(),
    status: candidateStatusEnum("status").notNull().default("NEW"),
    teamId: text("team_id").references(() => teams.id, { onDelete: "set null" }),
    designation: text("designation"),
    skillLevel: integer("skill_level"), // 1-5
    notes: text("notes"),

    // Essential links for MVP workflow
    assignedAssessorId: text("assigned_assessor_id").references(() => users.id, {
      onDelete: "set null",
    }), // Set null if user deleted
    assignedGroomerId: text("assigned_groomer_id").references(() => users.id, {
      onDelete: "set null",
    }), // Set null if user deleted

    // MVP fields for final stages (manual input by PM)
    clientInterviewQuestions: text("client_interview_questions"),
    placementDetails: text("placement_details"), // Simple text for client/project info

    // Timestamps
    deletedAt: timestamp("deleted_at", { mode: "date" }), // For soft delete
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    // Indexes
    index("candidate_status_idx").on(table.status),
    uniqueIndex("candidate_email_idx").on(table.email),
    index("candidate_assessor_idx").on(table.assignedAssessorId), // Added index
    index("candidate_groomer_idx").on(table.assignedGroomerId), // Added index
    index("candidate_team_idx").on(table.teamId),
  ],
);

// Relations
export const candidatesRelations = relations(candidates, ({ one }) => ({
  // Assigned roles
  assignedAssessor: one(users, {
    fields: [candidates.assignedAssessorId],
    references: [users.id],
    relationName: "AssessorCandidates", // Match relation name in usersRelations
  }),
  assignedGroomer: one(users, {
    fields: [candidates.assignedGroomerId],
    references: [users.id],
    relationName: "GroomerCandidates", // Match relation name in usersRelations
  }),

  // History items
  // assessments: many(assessments),
  // groomingLogs: many(groomingLogs),
}));

//  select Quries
export const selectTeamSchema = createSelectSchema(teams);
export const selectCandidateSchema = createSelectSchema(candidates);

// Select Types
export type TeamType = typeof teams.$inferSelect;
export type CandidateType = typeof candidates.$inferSelect;
