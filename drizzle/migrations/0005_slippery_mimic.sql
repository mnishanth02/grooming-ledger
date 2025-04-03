CREATE TABLE "candidate_skills" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_id" text NOT NULL,
	"skill_id" text NOT NULL,
	"proficiency_level" integer
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "topics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "candidate_skills" ADD CONSTRAINT "candidate_skills_candidate_id_candidate_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_skills" ADD CONSTRAINT "candidate_skills_skill_id_topics_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidate_skill_unique" ON "candidate_skills" USING btree ("candidate_id","skill_id");--> statement-breakpoint
CREATE INDEX "topic_name_idx" ON "topics" USING btree ("name");--> statement-breakpoint
CREATE INDEX "topic_category_idx" ON "topics" USING btree ("category");