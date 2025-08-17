import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  numeric,
  primaryKey,
} from 'drizzle-orm/pg-core';

// ---------- COMMON HELPERS ----------
const idCol = (name = 'id') => serial(name).primaryKey();
const userIdCol = () =>
  integer('user_id').references(() => users.id, { onDelete: 'cascade' });
const createdAtCol = () =>
  timestamp('created_at', { withTimezone: true }).defaultNow();
const updatedAtCol = () =>
  timestamp('updated_at', { withTimezone: true }).defaultNow();

// ---------- USERS ----------
export const users = pgTable('users', {
  id: idCol('user_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  username: text('username').notNull().unique(),
});

// ---------- GENERIC PROFILES ----------
export const profiles = pgTable('profiles', {
  id: idCol(),
  userId: userIdCol(),
  email: text('email'),
  title: text('title').default(''),
  avatar: text('avatar').default(''),
  location: text('location').default(''),
  phone: text('phone').default(''),
  bio: text('bio').default(''),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('0'),
  completedProjects: integer('completed_projects').default(0),
  reviewCount: integer('review_count').default(0),
  createdAt: createdAtCol(),
  updatedAt: updatedAtCol(),
});

// ---------- ARTISTS ----------
export const artistsProfiles = pgTable('artists_profile', {
  id: idCol(),
  userId: userIdCol(),
  email: text('email'),
  specialty: text('specialty'),
  avatar: text('avatar'),
  location: text('location'),
  phone: text('phone'),
  bio: text('bio'),
  createdAt: createdAtCol(),
  updatedAt: updatedAtCol(),
});

// ---------- INVESTORS ----------
export const investorsProfiles = pgTable('investors_profiles', {
  id: idCol(),
  userId: userIdCol(),
  // add comany id
  email: text('email'),
  title: text('title'),
  firm: text('firm'),
  avatar: text('avatar'),
  location: text('location'),
  phone: text('phone'),
  bio: text('bio'),
  investmentRange: text('investment_range'),
  createdAt: createdAtCol(),
  updatedAt: updatedAtCol(),
});

// how to allow artist to view artists portfolio

// ---------- COMPANIES ----------
export const companies = pgTable('companies', {
  id: idCol(),
  userId: userIdCol(),
  email: text('email'),
  companyName: text('company_name').notNull(),
  industry: text('industry'),
  logo: text('logo'),
  location: text('location'),
  website: text('website'),
  phone: text('phone'),
  description: text('description'),
  companySize: text('company_size'),
  founded: text('founded'),
  createdAt: createdAtCol(),
  updatedAt: updatedAtCol(),
});

// ---------- SKILLS ----------
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

// ---------- EXPERIENCE ----------
export const experience = pgTable('experience', {
  id: idCol(),
  userId: userIdCol(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  period: text('period').notNull(),
  description: text('description'),
});

// ---------- PROJECTS ----------
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

// ---------- LOOKUP TABLES ----------
export const focusAreas = pgTable('focus_areas', {
  id: idCol(),
  name: text('name').notNull().unique(),
});

export const investmentStages = pgTable('investment_stages', {
  id: idCol(),
  name: text('name').notNull().unique(),
});

export const benefits = pgTable('benefits', {
  id: idCol(),
  name: text('name').notNull().unique(),
});

// ---------- MANY-TO-MANY RELATIONS ----------
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

// ---------- INVESTOR DATA ----------
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

// ---------- COMPANY DATA ----------
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

// ---------- ARTIST DATA ----------
export const portfolios = pgTable('portfolios', {
  id: idCol(),
  artistId: integer('artist_id').references(() => artistsProfiles.id, {
    onDelete: 'cascade',
  }),
  title: text('title').notNull(),
  image: text('image'),
  description: text('description'),
  likes: integer('likes').default(0),
  views: integer('views').default(0),
  category: text('category'),
});

export const artistStats = pgTable('artist_stats', {
  id: idCol(),
  artistId: integer('artist_id')
    .unique()
    .references(() => artistsProfiles.id, { onDelete: 'cascade' }),
  totalLikes: integer('total_likes').default(0),
  totalViews: integer('total_views').default(0),
  followers: integer('followers').default(0),
  projects: integer('projects').default(0),
});
