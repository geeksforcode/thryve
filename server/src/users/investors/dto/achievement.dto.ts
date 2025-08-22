import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAchievementDto {
  @IsNumber()
  investorId!: number;

  @IsString()
  description!: string;
}

export class UpdateAchievementDto {
  @IsString()
  @IsOptional()
  description?: string;
}
