CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"investor_id" integer,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artist_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist_id" integer,
	"total_likes" integer DEFAULT 0,
	"total_views" integer DEFAULT 0,
	"followers" integer DEFAULT 0,
	"projects" integer DEFAULT 0,
	CONSTRAINT "artist_stats_artist_id_unique" UNIQUE("artist_id")
);
--> statement-breakpoint
CREATE TABLE "artists_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" text,
	"specialty" text,
	"avatar" text,
	"location" text,
	"phone" text,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "benefits" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "benefits_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" text,
	"company_name" text NOT NULL,
	"industry" text,
	"logo" text,
	"location" text,
	"website" text,
	"phone" text,
	"description" text,
	"company_size" text,
	"founded" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "company_benefits" (
	"company_id" integer,
	"benefit_id" integer,
	CONSTRAINT "company_benefits_company_id_benefit_id_pk" PRIMARY KEY("company_id","benefit_id")
);
--> statement-breakpoint
CREATE TABLE "company_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer,
	"total_employees" integer DEFAULT 0,
	"open_positions" integer DEFAULT 0,
	"avg_salary" text,
	"rating" numeric(2, 1) DEFAULT '0',
	CONSTRAINT "company_stats_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"period" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "focus_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "focus_areas_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "investment_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "investment_stages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "investor_focus_areas" (
	"investor_id" integer,
	"focus_area_id" integer,
	CONSTRAINT "investor_focus_areas_investor_id_focus_area_id_pk" PRIMARY KEY("investor_id","focus_area_id")
);
--> statement-breakpoint
CREATE TABLE "investor_investment_stages" (
	"investor_id" integer,
	"stage_id" integer,
	CONSTRAINT "investor_investment_stages_investor_id_stage_id_pk" PRIMARY KEY("investor_id","stage_id")
);
--> statement-breakpoint
CREATE TABLE "investor_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"investor_id" integer,
	"total_investments" integer DEFAULT 0,
	"portfolio_value" text,
	"successful_exits" integer DEFAULT 0,
	"avg_ticket_size" text,
	CONSTRAINT "investor_stats_investor_id_unique" UNIQUE("investor_id")
);
--> statement-breakpoint
CREATE TABLE "investors_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" text,
	"title" text,
	"firm" text,
	"avatar" text,
	"location" text,
	"phone" text,
	"bio" text,
	"investment_range" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_requirements" (
	"job_id" integer,
	"requirement" text NOT NULL,
	CONSTRAINT "job_requirements_job_id_requirement_pk" PRIMARY KEY("job_id","requirement")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer,
	"title" text NOT NULL,
	"department" text,
	"type" text,
	"salary" text,
	"posted" text,
	"applicants" integer DEFAULT 0,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "portfolio_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"investor_id" integer,
	"name" text NOT NULL,
	"description" text,
	"investment" text,
	"stage" text,
	"year" text,
	"category" text
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist_id" integer,
	"title" text NOT NULL,
	"image" text,
	"description" text,
	"likes" integer DEFAULT 0,
	"views" integer DEFAULT 0,
	"category" text
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" text,
	"title" text DEFAULT '',
	"avatar" text DEFAULT '',
	"location" text DEFAULT '',
	"phone" text DEFAULT '',
	"bio" text DEFAULT '',
	"rating" numeric(2, 1) DEFAULT '0',
	"completed_projects" integer DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_tech" (
	"project_id" integer,
	"tech_name" text NOT NULL,
	CONSTRAINT "project_tech_project_id_tech_name_pk" PRIMARY KEY("project_id","tech_name")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"description" text,
	"link" text
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_skills" (
	"user_id" integer,
	"skill_id" integer,
	CONSTRAINT "user_skills_user_id_skill_id_pk" PRIMARY KEY("user_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"username" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_investor_id_investors_profiles_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_stats" ADD CONSTRAINT "artist_stats_artist_id_artists_profile_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artists_profile" ADD CONSTRAINT "artists_profile_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_benefits" ADD CONSTRAINT "company_benefits_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_benefits" ADD CONSTRAINT "company_benefits_benefit_id_benefits_id_fk" FOREIGN KEY ("benefit_id") REFERENCES "public"."benefits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_stats" ADD CONSTRAINT "company_stats_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_focus_areas" ADD CONSTRAINT "investor_focus_areas_investor_id_investors_profiles_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_focus_areas" ADD CONSTRAINT "investor_focus_areas_focus_area_id_focus_areas_id_fk" FOREIGN KEY ("focus_area_id") REFERENCES "public"."focus_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investment_stages" ADD CONSTRAINT "investor_investment_stages_investor_id_investors_profiles_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_investment_stages" ADD CONSTRAINT "investor_investment_stages_stage_id_investment_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."investment_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_stats" ADD CONSTRAINT "investor_stats_investor_id_investors_profiles_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investors_profiles" ADD CONSTRAINT "investors_profiles_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_requirements" ADD CONSTRAINT "job_requirements_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_companies" ADD CONSTRAINT "portfolio_companies_investor_id_investors_profiles_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_artist_id_artists_profile_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tech" ADD CONSTRAINT "project_tech_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;