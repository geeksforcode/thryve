
import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db/client';
import {
	investorsProfiles,
	companies,
	focusAreas,
	investmentStages,
	investorFocusAreas,
	investorInvestmentStages,
	achievements,
	investorStats,
	portfolioCompanies,
} from '../../db/schema';

@Injectable()
export class InvestorsService {
	// INVESTOR PROFILE CRUD
	async createProfile(data: any) {
		const [profile] = await db.insert(investorsProfiles).values(data).returning();
		return profile;
	}

	async getProfile(id: number) {
		const [profile] = await db.select().from(investorsProfiles).where(eq(investorsProfiles.id, id));
		if (!profile) throw new NotFoundException('Investor profile not found');

		// Hydrate relations
		const [stats] = await db.select().from(investorStats).where(eq(investorStats.investorId, id));
		const ach = await db.select().from(achievements).where(eq(achievements.investorId, id));
		const focus = await db
			.select({ id: focusAreas.id, name: focusAreas.name })
			.from(investorFocusAreas)
			.innerJoin(focusAreas, eq(investorFocusAreas.focusAreaId, focusAreas.id))
			.where(eq(investorFocusAreas.investorId, id));
		const stages = await db
			.select({ id: investmentStages.id, name: investmentStages.name })
			.from(investorInvestmentStages)
			.innerJoin(investmentStages, eq(investorInvestmentStages.stageId, investmentStages.id))
			.where(eq(investorInvestmentStages.investorId, id));
		const companiesList = await db.select().from(portfolioCompanies).where(eq(portfolioCompanies.investorId, id));

		return {
			...profile,
			stats,
			achievements: ach,
			focusAreas: focus,
			investmentStages: stages,
			portfolioCompanies: companiesList,
		};
	}

	async updateProfile(id: number, data: any) {
		const [profile] = await db.update(investorsProfiles).set(data).where(eq(investorsProfiles.id, id)).returning();
		if (!profile) throw new NotFoundException('Investor profile not found');
		return profile;
	}

	async deleteProfile(id: number) {
		// Cascade delete handled by DB schema (onDelete: 'cascade')
		const [profile] = await db.delete(investorsProfiles).where(eq(investorsProfiles.id, id)).returning();
		if (!profile) throw new NotFoundException('Investor profile not found');
		return profile;
	}

	// FOCUS AREAS
	async addFocusArea(investorId: number, focusAreaId: number) {
		await db.insert(investorFocusAreas).values({ investorId, focusAreaId });
		return this.getProfile(investorId);
	}
	async removeFocusArea(investorId: number, focusAreaId: number) {
		await db.delete(investorFocusAreas).where(and(eq(investorFocusAreas.investorId, investorId), eq(investorFocusAreas.focusAreaId, focusAreaId)));
		return this.getProfile(investorId);
	}

	// INVESTMENT STAGES
	async addInvestmentStage(investorId: number, stageId: number) {
		await db.insert(investorInvestmentStages).values({ investorId, stageId });
		return this.getProfile(investorId);
	}
	async removeInvestmentStage(investorId: number, stageId: number) {
		await db.delete(investorInvestmentStages).where(and(eq(investorInvestmentStages.investorId, investorId), eq(investorInvestmentStages.stageId, stageId)));
		return this.getProfile(investorId);
	}

	// ACHIEVEMENTS
	async addAchievement(investorId: number, data: any) {
		const [ach] = await db.insert(achievements).values({ ...data, investorId }).returning();
		return ach;
	}
	async updateAchievement(id: number, data: any) {
		const [ach] = await db.update(achievements).set(data).where(eq(achievements.id, id)).returning();
		if (!ach) throw new NotFoundException('Achievement not found');
		return ach;
	}
	async deleteAchievement(id: number) {
		const [ach] = await db.delete(achievements).where(eq(achievements.id, id)).returning();
		if (!ach) throw new NotFoundException('Achievement not found');
		return ach;
	}

	// INVESTOR STATS
	async setStats(investorId: number, data: any) {
		// Upsert
		const [stats] = await db
			.insert(investorStats)
			.values({ ...data, investorId })
			.onConflictDoUpdate({ target: investorStats.investorId, set: data })
			.returning();
		return stats;
	}

	// PORTFOLIO COMPANIES
	async addPortfolioCompany(investorId: number, data: any) {
		const [company] = await db.insert(portfolioCompanies).values({ ...data, investorId }).returning();
		return company;
	}
	async updatePortfolioCompany(id: number, data: any) {
		const [company] = await db.update(portfolioCompanies).set(data).where(eq(portfolioCompanies.id, id)).returning();
		if (!company) throw new NotFoundException('Portfolio company not found');
		return company;
	}
	async deletePortfolioCompany(id: number) {
		const [company] = await db.delete(portfolioCompanies).where(eq(portfolioCompanies.id, id)).returning();
		if (!company) throw new NotFoundException('Portfolio company not found');
		return company;
	}
}
