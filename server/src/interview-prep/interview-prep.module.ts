// interview-prep.module.ts
import { Module } from '@nestjs/common';
import { InterviewPrepService } from './interview-prep.service';
import { InterviewPrepController } from './interview-prep.controller';

@Module({
  controllers: [InterviewPrepController],
  providers: [InterviewPrepService],
  exports: [InterviewPrepService], // if needed in other modules
})
export class InterviewPrepModule {}
