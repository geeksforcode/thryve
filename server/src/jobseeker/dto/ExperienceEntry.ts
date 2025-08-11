import { IsString, IsOptional, IsDateString } from 'class-validator';
export class ExperienceEntry {
  @IsString()
  company!: string;
  @IsString()
  position!: string;
  @IsDateString()
  startDate!: string;
  @IsOptional()
  @IsDateString()
  endDate?: string;
  @IsOptional()
  @IsString()
  description?: string;
}
