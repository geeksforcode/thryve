CREATE TABLE "job_seekers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"full_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"resume_url" text,
	"bio" text,
	"skills" jsonb,
	"education" jsonb,
	"experience" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"company" varchar(255),
	"location" varchar(255),
	"skills_required" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"username" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
