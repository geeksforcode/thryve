import { Controller, Get, Param } from '@nestjs/common';
import { InterviewPrepService } from './interview-prep.service';

@Controller('interview-prep')
export class InterviewPrepController {
  constructor(private readonly interviewPrepService: InterviewPrepService) {}

  @Get(':category')
  getByCategory(@Param('category') category: string) {
    return this.interviewPrepService.getQuestionsByCategory(category);
  }
}
