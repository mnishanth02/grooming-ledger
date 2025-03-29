import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// -------------------------
// ENUMS (MVP Only)
// -------------------------
export const userRoleEnum = pgEnum("user_role", ["PROJECT MANAGER", "ASSOCIATE", "ADMIN"]); // Keep ADMIN for management

export const candidateStatusEnum = pgEnum("candidate_status", [
  "NEW",
  "PRE_ASSESSMENT_PENDING",
  "GROOMING_IN_PROGRESS",
  "POST_ASSESSMENT_PENDING",
  "ASSESSMENT_PASSED",
  "ASSESSMENT_FAILED",
  "CLIENT_INTERVIEW_SCHEDULED", // Kept as PM might manually set this
  "CLIENT_INTERVIEW_FAILED",
  "PLACED",
  "TERMINATED",
]);

export const assessmentTypeEnum = pgEnum("assessment_type", ["PRE_ASSESSMENT", "POST_ASSESSMENT"]);

export const assessmentOutcomeEnum = pgEnum("assessment_outcome", ["PASS", "FAIL"]); // For POST_ASSESSMENT

// -------------------------
// AUTH TABLES (Auth.js - Unchanged)
// -------------------------
export const users = pgTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  },
  (user) => ({
    emailIdx: uniqueIndex("user_email_idx").on(user.email),
  }),
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("account_userId_idx").on(account.userId), // Added index
  }),
);

// -------------------------
// APPLICATION TABLES (MVP)
// -------------------------

// Simplified user profile for application role
export const userProfiles = pgTable("user_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").notNull().default("ASSOCIATE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()), // Corrected updatedAt
});

// Simplified candidate table focused on grooming lifecycle tracking
export const candidates = pgTable(
  "candidate",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    onboardingDate: date("onboarding_date").notNull(),
    status: candidateStatusEnum("status").notNull().default("NEW"),

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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`current_timestamp`)
      .$onUpdate(() => new Date()), // Corrected updatedAt
  },
  (table) => ({
    // Indexes
    statusIdx: index("candidate_status_idx").on(table.status),
    emailIdx: uniqueIndex("candidate_email_idx").on(table.email),
    assessorIdx: index("candidate_assessor_idx").on(table.assignedAssessorId), // Added index
    groomerIdx: index("candidate_groomer_idx").on(table.assignedGroomerId), // Added index
  }),
);

// Core assessments table
export const assessments = pgTable(
  "assessment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    candidateId: uuid("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    assessorId: text("assessor_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Don't delete user if they assessed
    assessmentType: assessmentTypeEnum("assessment_type").notNull(),
    overallOutcome: assessmentOutcomeEnum("overall_outcome"), // Nullable, only for POST_ASSESSMENT
    submissionTimestamp: timestamp("submission_timestamp").defaultNow().notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`current_timestamp`)
      .$onUpdate(() => new Date()), // Corrected updatedAt
  },
  (table) => ({
    // Indexes
    candidateTypeIdx: index("assessment_candidate_type_idx").on(
      table.candidateId,
      table.assessmentType,
    ),
    assessorIdx: index("assessment_assessor_idx").on(table.assessorId), // Added index
  }),
);

// Feedback items linked to assessments
export const assessmentFeedbackItems = pgTable(
  "assessment_feedback_item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }), // Cascade delete with assessment
    topic: text("topic").notNull(),
    subTopic: text("sub_topic"), // Optional
    rating: integer("rating").notNull(), // 1-5
    comments: text("comments"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`current_timestamp`)
      .$onUpdate(() => new Date()), // Added/Corrected updatedAt
  },
  (table) => ({
    assessmentIdx: index("feedback_assessment_idx").on(table.assessmentId), // Added index
  }),
);

// Core grooming log table
export const groomingLogs = pgTable(
  "grooming_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    candidateId: uuid("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    groomerId: text("groomer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Don't delete user if they logged grooming
    logDate: timestamp("log_date").defaultNow().notNull(), // Timestamp of the log entry
    topicsCovered: text("topics_covered").notNull(),
    assessedByGroomer: boolean("assessed_by_groomer").default(false).notNull(),
    comments: text("comments"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`current_timestamp`)
      .$onUpdate(() => new Date()), // Added/Corrected updatedAt
  },
  (table) => ({
    // Indexes
    candidateIdx: index("log_candidate_idx").on(table.candidateId),
    groomerIdx: index("log_groomer_idx").on(table.groomerId),
    logDateIdx: index("log_date_idx").on(table.logDate),
  }),
);

// -------------------------
// RELATIONS (MVP)
// -------------------------
export const usersRelations = relations(users, ({ one, many }) => ({
  // Auth.js relations
  accounts: many(accounts),

  // Link to app-specific profile
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),

  // Candidates this user is assigned to
  candidatesAssignedAsAssessor: many(candidates, { relationName: "AssessorCandidates" }),
  candidatesAssignedAsGroomer: many(candidates, { relationName: "GroomerCandidates" }),

  // Activities performed by this user
  assessmentsPerformed: many(assessments),
  groomingLogsCreated: many(groomingLogs),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  // Link back to the main user table
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
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
  assessments: many(assessments),
  groomingLogs: many(groomingLogs),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  // Link back to candidate and assessor
  candidate: one(candidates, { fields: [assessments.candidateId], references: [candidates.id] }),
  assessor: one(users, { fields: [assessments.assessorId], references: [users.id] }),

  // Detailed feedback
  feedbackItems: many(assessmentFeedbackItems),
}));

export const assessmentFeedbackItemsRelations = relations(assessmentFeedbackItems, ({ one }) => ({
  // Link back to the parent assessment
  assessment: one(assessments, {
    fields: [assessmentFeedbackItems.assessmentId],
    references: [assessments.id],
  }),
}));

export const groomingLogsRelations = relations(groomingLogs, ({ one }) => ({
  // Link back to candidate and groomer
  candidate: one(candidates, { fields: [groomingLogs.candidateId], references: [candidates.id] }),
  groomer: one(users, { fields: [groomingLogs.groomerId], references: [users.id] }),
}));
