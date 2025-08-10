import { Module } from '@nestjs/common';
import { JobSeekerController } from './jobseeker.controller';
import { JobSeekerService } from './jobseeker.service';
import { JobModule } from '../job/job.module';
import { InterviewPrepModule } from '../interview-prep/interview-prep.module';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [AuthModule, JobModule],
  controllers: [JobSeekerController],
  providers: [JobSeekerService]
})
export class JobSeekerModule {}
