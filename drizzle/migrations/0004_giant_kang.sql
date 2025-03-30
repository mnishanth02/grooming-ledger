CREATE TABLE "candidate" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"years_of_experience" integer,
	"resume_url" text,
	"linkedin_url" text,
	"github_url" text,
	"portfolio_url" text,
	"onboarding_date" date NOT NULL,
	"status" "candidate_status" DEFAULT 'NEW' NOT NULL,
	"team_id" text,
	"designation" text,
	"skill_level" integer,
	"notes" text,
	"assigned_assessor_id" text,
	"assigned_groomer_id" text,
	"client_interview_questions" text,
	"placement_details" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "candidate_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_assigned_assessor_id_users_id_fk" FOREIGN KEY ("assigned_assessor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_assigned_groomer_id_users_id_fk" FOREIGN KEY ("assigned_groomer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidate_status_idx" ON "candidate" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "candidate_email_idx" ON "candidate" USING btree ("email");--> statement-breakpoint
CREATE INDEX "candidate_assessor_idx" ON "candidate" USING btree ("assigned_assessor_id");--> statement-breakpoint
CREATE INDEX "candidate_groomer_idx" ON "candidate" USING btree ("assigned_groomer_id");--> statement-breakpoint
CREATE INDEX "candidate_team_idx" ON "candidate" USING btree ("team_id");