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
