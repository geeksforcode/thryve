import { serial, timestamp, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const idCol = (name = 'id') => serial(name).primaryKey();
export const createdAtCol = () =>
  timestamp('created_at', { withTimezone: true }).defaultNow();
export const updatedAtCol = () =>
  timestamp('updated_at', { withTimezone: true }).defaultNow();
export const userIdCol = () =>
  integer('user_id').references(() => users.id, { onDelete: 'cascade' });
