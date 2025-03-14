import { pgEnum } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

// Enums for Order Status and other fixed value fields
export const userRoleEnum = pgEnum("user_role", ["manager", "assessor", "groomer", "candidate"]);
export const groomingStatusEnum = pgEnum("grooming_status", [
  "not_started",
  "grooming",
  "pre_assessment",
  "post_assessment",
  "client_interview",
  "completed",
  "terminated",
]);
export const assessmentTypeEnum = pgEnum("assessment_type", ["pre", "post"]);
export const assessmentOutcomeEnum = pgEnum("assessment_outcome", [
  "positive",
  "negative",
  "pending",
]);
export const groomingCycleStatusEnum = pgEnum("grooming_cycle_status", [
  "active",
  "completed",
  "cancelled",
]);
export const assessmentScheduleStatusEnum = pgEnum("assessment_schedule_status", [
  "scheduled",
  "confirmed",
  "cancelled",
  "completed",
]);
export const groomingTopicStatusEnum = pgEnum("grooming_topic_status", [
  "not_started",
  "grooming",
  "groomer_assessed",
  "pre_assessment_done",
  "post_assessment_done",
]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "pending"]);

//  Select Schemas
export const userRoleSchema = createSelectSchema(userRoleEnum);
