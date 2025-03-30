ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
DROP INDEX "users_employee_id_idx";--> statement-breakpoint
DROP INDEX "users_department_idx";--> statement-breakpoint
DROP INDEX "users_email_idx";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "team_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_team_id_idx" ON "users" USING btree ("team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");