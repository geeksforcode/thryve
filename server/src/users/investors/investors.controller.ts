
import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	ParseIntPipe,
} from '@nestjs/common';

import { InvestorsService } from './investors.service';
import { CreateInvestorProfileDto, UpdateInvestorProfileDto } from './dto/investor-profile.dto';
import { CreateFocusAreaDto } from './dto/focus-area.dto';
import { CreateInvestmentStageDto } from './dto/investment-stage.dto';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';
import { SetInvestorStatsDto } from './dto/investor-stats.dto';
import { CreatePortfolioCompanyDto, UpdatePortfolioCompanyDto } from './dto/portfolio-company.dto';

@Controller('investor-profile')
export class InvestorsController {
	investorsService: any;
	constructor(private readonly service: InvestorsService) {}

	// Investor Profile

	@Post()
	create(@Body() body: CreateInvestorProfileDto) {
		return this.service.createProfile(body);
	}

	@Get('investor-profile')
	async getAll() {
		return this.investorsService. getAllProfiles();
	}

	@Get(':id')
	get(@Param('id', ParseIntPipe) id: number) {
		return this.service.getProfile(id);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateInvestorProfileDto) {
		return this.service.updateProfile(id, body);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.service.deleteProfile(id);
	}

	// Focus Areas

	@Post(':id/focus-areas')
	addFocusArea(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateFocusAreaDto) {
		return this.service.addFocusArea(id, dto.focusAreaId);
	}

	@Delete(':id/focus-areas/:focusAreaId')
	removeFocusArea(@Param('id', ParseIntPipe) id: number, @Param('focusAreaId', ParseIntPipe) focusAreaId: number) {
		return this.service.removeFocusArea(id, focusAreaId);
	}

	// Investment Stages

	@Post(':id/investment-stages')
	addInvestmentStage(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateInvestmentStageDto) {
		return this.service.addInvestmentStage(id, dto.stageId);
	}

	@Delete(':id/investment-stages/:stageId')
	removeInvestmentStage(@Param('id', ParseIntPipe) id: number, @Param('stageId', ParseIntPipe) stageId: number) {
		return this.service.removeInvestmentStage(id, stageId);
	}

	// Achievements

	@Post(':id/achievements')
	addAchievement(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAchievementDto) {
		return this.service.addAchievement(id, dto);
	}

	@Patch(':id/achievements/:achievementId')
	updateAchievement(@Param('achievementId', ParseIntPipe) achievementId: number, @Body() dto: UpdateAchievementDto) {
		return this.service.updateAchievement(achievementId, dto);
	}
	
	@Delete(':id/achievements/:achievementId')
	deleteAchievement(@Param('achievementId', ParseIntPipe) achievementId: number) {
		return this.service.deleteAchievement(achievementId);
	}

	// Stats

	@Post(':id/stats')
	setStats(@Param('id', ParseIntPipe) id: number, @Body() dto: SetInvestorStatsDto) {
		return this.service.setStats(id, dto);
	}

	// Portfolio Companies

	@Post(':id/company')
	addCompany(@Param('id', ParseIntPipe) id: number, @Body() dto: CreatePortfolioCompanyDto) {
		return this.service.addPortfolioCompany(id, dto);
	}

	@Patch(':id/company/:companyId')
	updateCompany(@Param('companyId', ParseIntPipe) companyId: number, @Body() dto: UpdatePortfolioCompanyDto) {
		return this.service.updatePortfolioCompany(companyId, dto);
	}

	@Delete(':id/company/:companyId')
	deleteCompany(@Param('companyId', ParseIntPipe) companyId: number) {
		return this.service.deletePortfolioCompany(companyId);
	}
}
