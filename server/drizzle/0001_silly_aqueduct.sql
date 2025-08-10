CREATE TABLE "interview_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"question" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
