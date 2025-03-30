import { relations } from "drizzle-orm";
import {
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Define enums
export const userRoleEnum = pgEnum("user_role", ["admin", "pm", "assessor", "groomer"]);
export const statusEnum = pgEnum("status", ["available", "busy", "unavailable"]);
export const assignmentStatusEnum = pgEnum("assignment_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);
export const candidateStatusEnum = pgEnum("candidate_status", [
  "new",
  "in_assessment",
  "in_grooming",
  "groomed",
  "hired",
  "rejected",
]);
export const assignmentRoleEnum = pgEnum("assignment_role", ["assessor", "groomer"]);
export const assessmentResultEnum = pgEnum("assessment_result", ["pass", "fail", "pending"]);

// Users/Associates table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password"), // Hashed password
    phone: text("phone"),
    department: text("department"),
    role: userRoleEnum("role").notNull().default("assessor"),
    status: statusEnum("status").default("available"),
    avatarUrl: text("avatar_url"),
    startDate: date("start_date"),
    skills: jsonb("skills").$type<string[]>().default([]),
    availability: integer("availability").default(100), // percentage
    performanceRating: integer("performance_rating"), // 1-5
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      emailIdx: index("email_idx").on(table.email),
      nameIdx: index("name_idx").on(table.name),
    };
  },
);

// Candidates table
export const candidates = pgTable(
  "candidates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    currentCompany: text("current_company"),
    yearsOfExperience: integer("years_of_experience"),
    resumeUrl: text("resume_url"),
    linkedinUrl: text("linkedin_url"),
    githubUrl: text("github_url"),
    portfolioUrl: text("portfolio_url"),
    status: candidateStatusEnum("status").default("new"),
    notes: text("notes"),
    skillLevel: integer("skill_level"), // 1-5
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      candidateEmailIdx: index("candidate_email_idx").on(table.email),
      candidateNameIdx: index("candidate_name_idx").on(table.name),
    };
  },
);

// Candidate Skills (Many-to-Many)
export const candidateSkills = pgTable(
  "candidate_skills",
  {
    id: serial("id").primaryKey(),
    candidateId: uuid("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    proficiencyLevel: integer("proficiency_level"), // 1-5
  },
  (table) => {
    return {
      candidateSkillUnique: unique().on(table.candidateId, table.skillId),
    };
  },
);

// Topics table (skills/subjects)
export const topics = pgTable(
  "topics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    category: text("category"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      topicNameIdx: index("topic_name_idx").on(table.name),
    };
  },
);

// Interview Questions table
export const interviewQuestions = pgTable("interview_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer"),
  difficulty: integer("difficulty"), // 1-5
  topicId: uuid("topic_id").references(() => topics.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignments table (links candidates with assessors/groomers)
export const assignments = pgTable(
  "assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    candidateId: uuid("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: assignmentRoleEnum("role").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    status: assignmentStatusEnum("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      assignmentUserIdx: index("assignment_user_idx").on(table.userId),
      assignmentCandidateIdx: index("assignment_candidate_idx").on(table.candidateId),
    };
  },
);

// Assessments table
export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  score: integer("score"), // 1-100
  feedback: text("feedback"),
  result: assessmentResultEnum("result").default("pending"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Grooming Logs table
export const groomingLogs = pgTable("grooming_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  duration: integer("duration"), // in minutes
  topics: jsonb("topics").$type<string[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  assignments: many(assignments),
}));

export const candidatesRelations = relations(candidates, ({ many }) => ({
  assignments: many(assignments),
  skills: many(candidateSkills),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  questions: many(interviewQuestions),
  candidateSkills: many(candidateSkills),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  candidate: one(candidates, {
    fields: [assignments.candidateId],
    references: [candidates.id],
  }),
  user: one(users, {
    fields: [assignments.userId],
    references: [users.id],
  }),
  assessments: many(assessments),
  groomingLogs: many(groomingLogs),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assessments.assignmentId],
    references: [assignments.id],
  }),
}));

export const groomingLogsRelations = relations(groomingLogs, ({ one }) => ({
  assignment: one(assignments, {
    fields: [groomingLogs.assignmentId],
    references: [assignments.id],
  }),
}));

export const candidateSkillsRelations = relations(candidateSkills, ({ one }) => ({
  candidate: one(candidates, {
    fields: [candidateSkills.candidateId],
    references: [candidates.id],
  }),
  skill: one(topics, {
    fields: [candidateSkills.skillId],
    references: [topics.id],
  }),
}));
