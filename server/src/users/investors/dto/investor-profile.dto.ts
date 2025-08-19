import { IsString, IsOptional, IsEmail, IsNumber, IsEnum } from 'class-validator';

export enum InvestorType {
  INDIVIDUAL = 'individual',
  VC = 'vc',
  ANGEL = 'angel',
  FIRM = 'firm',
}

export class CreateInvestorProfileDto {
  @IsNumber()
  userId!: number;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  firm?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  investmentRange?: string;
}

export class UpdateInvestorProfileDto extends CreateInvestorProfileDto {}
