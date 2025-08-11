import {
  pgTable,
  text,
  primaryKey,
  numeric,
  integer,
} from 'drizzle-orm/pg-core';
import { artistsProfile, investorsProfiles } from './profiles';
import { idCol, userIdCol } from './common';
import { companies } from './profiles';

export const focusAreas = pgTable('focus_areas', {
  id: idCol(),
  name: text('name').notNull().unique(),
});

export const investmentStages = pgTable('investment_stages', {
  id: idCol(),
  name: text('name').notNull().unique(),
});

export const artistStats = pgTable('artist_stats', {
  id: idCol(),
  artistId: integer('artist_id')
    .unique()
    .references(() => artistsProfile.id, { onDelete: 'cascade' }),
  totalLikes: integer('total_likes').default(0),
  totalViews: integer('total_views').default(0),
  followers: integer('followers').default(0),
  projects: integer('projects').default(0),
});

export const portfolioCompanies = pgTable('portfolio_companies', {
  id: idCol(),
  investorId: integer('investor_id').references(() => investorsProfiles.id, {
    onDelete: 'cascade',
  }),
  name: text('name').notNull(),
  description: text('description'),
  investment: text('investment'),
  stage: text('stage'),
  year: text('year'),
  category: text('category'),
});

export const achievements = pgTable('achievements', {
  id: idCol(),
  investorId: integer('investor_id').references(() => investorsProfiles.id, {
    onDelete: 'cascade',
  }),
  description: text('description').notNull(),
});

export const investorStats = pgTable('investor_stats', {
  id: idCol(),
  investorId: integer('investor_id')
    .unique()
    .references(() => investorsProfiles.id, { onDelete: 'cascade' }),
  totalInvestments: integer('total_investments').default(0),
  portfolioValue: text('portfolio_value'),
  successfulExits: integer('successful_exits').default(0),
  avgTicketSize: text('avg_ticket_size'),
});

export const investorFocusAreas = pgTable(
  'investor_focus_areas',
  {
    investorId: integer('investor_id').references(() => investorsProfiles.id, {
      onDelete: 'cascade',
    }),
    focusAreaId: integer('focus_area_id').references(() => focusAreas.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.investorId, table.focusAreaId] }),
  }),
);

export const investorInvestmentStages = pgTable(
  'investor_investment_stages',
  {
    investorId: integer('investor_id').references(() => investorsProfiles.id, {
      onDelete: 'cascade',
    }),
    stageId: integer('stage_id').references(() => investmentStages.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.investorId, table.stageId] }),
  }),
);

export const companyStats = pgTable('company_stats', {
  id: idCol(),
  companyId: integer('company_id')
    .unique()
    .references(() => companies.id, { onDelete: 'cascade' }),
  totalEmployees: integer('total_employees').default(0),
  openPositions: integer('open_positions').default(0),
  avgSalary: text('avg_salary'),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('0'),
});

export const portfolios = pgTable('portfolios', {
  id: idCol(),
  artistId: integer('artist_id').references(() => artistsProfile.id, {
    onDelete: 'cascade',
  }),
  title: text('title').notNull(),
  image: text('image'),
  description: text('description'),
  likes: integer('likes').default(0),
  views: integer('views').default(0),
  category: text('category'),
});

export const projects = pgTable('projects', {
  id: idCol(),
  userId: userIdCol(),
  name: text('name').notNull(),
  description: text('description'),
  link: text('link'),
});

export const projectTech = pgTable(
  'project_tech',
  {
    projectId: integer('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }),
    techName: text('tech_name').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.techName] }),
  }),
);
