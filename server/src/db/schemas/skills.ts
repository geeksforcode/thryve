import { pgTable, text, integer, primaryKey } from 'drizzle-orm/pg-core';
import { idCol, userIdCol } from './common';

export const skills = pgTable('skills', {
  id: idCol(),
  name: text('name').notNull().unique(),
});

export const userSkills = pgTable(
  'user_skills',
  {
    userId: userIdCol(),
    skillId: integer('skill_id').references(() => skills.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({ pk: primaryKey({ columns: [table.userId, table.skillId] }) }),
);
