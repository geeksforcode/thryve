import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFocusAreaDto {
  @IsNumber()
  focusAreaId!: number;
}
