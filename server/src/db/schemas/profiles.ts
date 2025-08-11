import { pgTable, text, integer, numeric } from 'drizzle-orm/pg-core';
import { idCol, userIdCol, createdAtCol, updatedAtCol } from './common';

export const profiles = pgTable('profiles', {
  id: idCol(),
  userId: userIdCol(),
  title: text('title'),
  avatar: text('avatar'),
  location: text('location'),
  phone: text('phone'),
  bio: text('bio'),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('0'),
  completedProjects: integer('completed_projects').default(0),
  reviewCount: integer('review_count').default(0),
  createdAt: createdAtCol(),
  updatedAt: updatedAtCol(),
});

export const artistsProfile = pgTable('artists_profile', {
  id: idCol(),
  userId: userIdCol(),
  specialty: text('specialty'),
  avatar: text('avatar'),
  location: text('location'),
  phone: text('phone'),
  bio: text('bio'),
  createdAt: createdAtCol(),
  updatedAt: updatedAtCol(),
});

export const investorsProfiles = pgTable('investors_profiles', {
  id: idCol(),
  userId: userIdCol(),
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

export const companies = pgTable('companies', {
  id: idCol(),
  companyName: text('company_name').notNull(),
  industry: text('industry'),
  logo: text('logo'),
  location: text('location'),
  website: text('website'),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  description: text('description'),
  companySize: text('company_size'),
  founded: text('founded'),
  createdAt: createdAtCol(),
  updatedAt: updatedAtCol(),
});
