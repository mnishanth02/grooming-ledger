CREATE TABLE "sub_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"topic_id" text NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sub_topics" ADD CONSTRAINT "sub_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sub_topic_name_idx" ON "sub_topics" USING btree ("name");--> statement-breakpoint
CREATE INDEX "sub_topic_topic_idx" ON "sub_topics" USING btree ("topic_id");