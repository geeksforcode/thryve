import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  varchar,
  jsonb,
  uuid,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('user_id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  username: text('username').notNull().unique(),
});


export const jobSeekers = pgTable('job_seekers', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id'),
  fullName: varchar('full_name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  resumeUrl: text('resume_url'),
  bio: text('bio'),
  skills: jsonb('skills'), // Array of skill strings
  education: jsonb('education'), // [{school, degree, startYear, endYear}]
  experience: jsonb('experience'), // [{company, title, start, end, description}]
  createdAt: timestamp('created_at').defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  company: varchar('company', { length: 255 }),
  location: varchar('location', { length: 255 }),
  skillsRequired: jsonb('skills_required').notNull(), // array of skill strings
  createdAt: timestamp('created_at').defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // e.g., "React", "Behavioral"
  question: text("question").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interviewQuestions = pgTable('interview_questions', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  category: text('category').notNull(),
});

