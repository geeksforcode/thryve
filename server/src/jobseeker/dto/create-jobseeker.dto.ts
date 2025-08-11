export class CreateJobseekerDto {}
import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EducationEntry as Education } from './EducationEntry';
import { ExperienceEntry as Experience } from './ExperienceEntry';

class EducationEntry {
  @IsString() school!: string;
  @IsString() degree!: string;
  @IsString() startYear!: string;
  @IsString() endYear!: string;
}

class ExperienceEntry {
  @IsString() company!: string;
  @IsString() title!: string;
  @IsString() start!: string;
  @IsString() end!: string;
  @IsOptional() @IsString() description?: string;
}
export class CreateJobSeekerDto {
  @IsString()
  name!: string;
  @IsEmail()
  email!: string;
  @IsOptional()
  @IsString()
  phone!: string;
  @IsOptional()
  @IsString()
  resumeUrl!: string;
  @IsOptional()
  @IsString()
  bio!: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills!: string[];
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntry)
  education!: Education[];
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceEntry)
  experience!: Experience[];
  @IsOptional()
  @IsString()
  userId!: string; // Comes from the Supabase token
}
