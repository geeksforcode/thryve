import { pgTable, text, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('user_id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  username: text('username').notNull().unique(),
});
