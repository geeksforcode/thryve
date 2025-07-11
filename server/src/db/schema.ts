import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  varchar,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('user_id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  username: text('username').notNull().unique(),
});
