import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EducationEntry {
  @IsString() school?: string;
  @IsString() degree?: string;
  @IsString() startYear?: string;
  @IsString() endYear?: string;
}

class ExperienceEntry {
  @IsString() company?: string;
  @IsString() title?: string;
  @IsString() start?: string;
  @IsString() end?: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdateJobSeekerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntry)
  education?: EducationEntry[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceEntry)
  experience?: ExperienceEntry[];
}

export class UpdateResumeDto {
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true })
  @Type(() => EducationEntry) education?: EducationEntry[];

  @IsOptional() @IsArray() @ValidateNested({ each: true })
  @Type(() => ExperienceEntry) experience?: ExperienceEntry[];

  @IsOptional() @IsArray() skills?: string[];
  @IsOptional() @IsString() resumeUrl?: string;
}

export class CreateQuestionDto {
  @IsString() category?: string;
  @IsString() question?: string;
}
