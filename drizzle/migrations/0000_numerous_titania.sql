CREATE TYPE "public"."assessment_outcome" AS ENUM('PASS', 'FAIL');--> statement-breakpoint
CREATE TYPE "public"."assessment_type" AS ENUM('PRE_ASSESSMENT', 'POST_ASSESSMENT');--> statement-breakpoint
CREATE TYPE "public"."candidate_status" AS ENUM('NEW', 'PRE_ASSESSMENT_PENDING', 'PRE_ASSESSMENT_COMPLETED', 'ASSESSMENT_PASSED', 'ASSESSMENT_FAILED', 'GROOMING_IN_PROGRESS', 'GROOMING_COMPLETED', 'POST_ASSESSMENT_PENDING', 'POST_ASSESSMENT_COMPLETED', 'CLIENT_INTERVIEW_SCHEDULED', 'CLIENT_INTERVIEW_FAILED', 'RE_GROOMING_SCHEDULED', 'PLACED', 'TERMINATED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('PROJECT MANAGER', 'ASSOCIATE', 'ADMIN', 'CANDIDATE');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"action" varchar(255) NOT NULL,
	"details" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image" text,
	"hashed_password" text,
	"email_verified" timestamp,
	"phone_number" text,
	"user_role" "user_role" DEFAULT 'CANDIDATE' NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_audit_logs" ADD CONSTRAINT "user_audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_audit_logs_user_id_idx" ON "user_audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_audit_logs_action_idx" ON "user_audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "user_audit_logs_created_at_idx" ON "user_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_name_idx" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("user_role");