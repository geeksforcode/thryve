CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"role" text DEFAULT 'user' NOT NULL,
	"username" text NOT NULL,
	"provider" text DEFAULT 'local' NOT NULL,
	"picture" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
