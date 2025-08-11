import { IsString } from 'class-validator';

export class EducationEntry {
  @IsString()
  institution!: string;

  @IsString()
  degree!: string;
}
