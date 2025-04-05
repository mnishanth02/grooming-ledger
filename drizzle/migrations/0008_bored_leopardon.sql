CREATE TABLE "associate_skills" (
	"id" text PRIMARY KEY NOT NULL,
	"associate_id" text NOT NULL,
	"skill_id" text NOT NULL,
	"proficiency_level" integer
);
--> statement-breakpoint
ALTER TABLE "associate_skills" ADD CONSTRAINT "associate_skills_associate_id_users_id_fk" FOREIGN KEY ("associate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "associate_skills" ADD CONSTRAINT "associate_skills_skill_id_topics_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "associate_skill_unique" ON "associate_skills" USING btree ("associate_id","skill_id");