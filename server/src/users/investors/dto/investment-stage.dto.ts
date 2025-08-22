import { IsNumber } from 'class-validator';

export class CreateInvestmentStageDto {
  @IsNumber()
  stageId!: number;
}
