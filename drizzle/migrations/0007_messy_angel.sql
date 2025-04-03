ALTER TABLE "topics" ADD COLUMN "team_id" text;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "topic_team_idx" ON "topics" USING btree ("team_id");