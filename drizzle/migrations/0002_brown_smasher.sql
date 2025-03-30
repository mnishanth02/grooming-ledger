ALTER TABLE "users" ADD COLUMN "designation" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "department" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "employee_id" text;--> statement-breakpoint
CREATE INDEX "users_employee_id_idx" ON "users" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "users_department_idx" ON "users" USING btree ("department");