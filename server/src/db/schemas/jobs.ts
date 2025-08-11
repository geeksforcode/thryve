import { pgTable, text, primaryKey, integer } from 'drizzle-orm/pg-core';
import { idCol } from './common';
import { companies } from './profiles';

export const jobs = pgTable('jobs', {
  id: idCol(),
  companyId: integer('company_id').references(() => companies.id, {
    onDelete: 'cascade',
  }),
  title: text('title').notNull(),
  department: text('department'),
  type: text('type'),
  salary: text('salary'),
  posted: text('posted'),
  applicants: integer('applicants').default(0),
  description: text('description'),
});

export const benefits = pgTable('benefits', {
  id: idCol(),
  name: text('name').notNull().unique(),
});

export const jobRequirements = pgTable(
  'job_requirements',
  {
    jobId: integer('job_id').references(() => jobs.id, { onDelete: 'cascade' }),
    requirement: text('requirement').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.jobId, table.requirement] }),
  }),
);

export const companyBenefits = pgTable(
  'company_benefits',
  {
    companyId: integer('company_id').references(() => companies.id, {
      onDelete: 'cascade',
    }),
    benefitId: integer('benefit_id').references(() => benefits.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.companyId, table.benefitId] }),
  }),
);
