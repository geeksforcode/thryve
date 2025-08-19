import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SetInvestorStatsDto {
  @IsNumber()
  @IsOptional()
  totalInvestments?: number;

  @IsString()
  @IsOptional()
  portfolioValue?: string;

  @IsNumber()
  @IsOptional()
  successfulExits?: number;

  @IsString()
  @IsOptional()
  avgTicketSize?: string;
}
