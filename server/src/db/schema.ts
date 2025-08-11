import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  json,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('user_id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  username: text('username').notNull().unique(),
});

export const artist = pgTable('artist', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  bio: text('bio'),
  skills: text('skills').array(), // e.g., ['painting', 'plumbing']
  rating: integer('rating'),
  userId: integer('user_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const interviewQuestions = pgTable('interview_questions', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  category: text('category'), // Optional field for categorizing your questions
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  postedAt: timestamp('posted_at').defaultNow(),
  skillsRequired: text('skills_required').array().notNull().default([]),
});

// Define a table for job seekers
export const jobSeekers = pgTable('job_seekers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  // New: Add a "skills" column as an array of text with an empty default:
  skills: text('skills').array().default([]),
  // New: Add a "userId" column if needed:
  userId: text('user_id'),
  // New: Add a "bio" column:
  bio: text('bio'),
  resumeUrl: text('resume_url'),
  education: json('education'),
  experience: json('experience'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  // Use "questionText" as the field to store the question’s text:
  questionText: text('question_text').notNull(),
  // Add a "category" column:
  category: text('category').default('general'),
  createdAt: timestamp('created_at').defaultNow(),
});
