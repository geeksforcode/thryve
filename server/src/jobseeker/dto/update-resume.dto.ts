import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EducationEntry {
  @IsOptional() @IsString()
  school?: string;

  @IsOptional() @IsString()
  degree?: string;

  @IsOptional() @IsString()
  startYear?: string;

  @IsOptional() @IsString()
  endYear?: string;
}

class ExperienceEntry {
  @IsOptional() @IsString()
  company?: string;

  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  start?: string;

  @IsOptional() @IsString()
  end?: string;

  @IsOptional() @IsString()
  description?: string;
}

export class UpdateResumeDto {
  @IsOptional() @IsString()
  bio?: string;

  @IsOptional() @IsString()
  resumeUrl?: string;

  @IsOptional() @IsArray()
  skills?: string[];

  @IsOptional() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntry)
  education?: EducationEntry[];

  @IsOptional() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceEntry)
  experience?: ExperienceEntry[];
}
