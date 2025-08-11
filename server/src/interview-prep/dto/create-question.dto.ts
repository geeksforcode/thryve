import { IsString, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  // Required property, matching the schema
  question!: string;
  @IsOptional()
  @IsString()
  category?: string;
}
