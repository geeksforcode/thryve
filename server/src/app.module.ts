import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { JobSeekerModule } from './jobseeker/jobseeker.module';
import { JobModule } from './job/job.module';
import { InterviewPrepService } from './interview-prep/interview-prep.service';
import { InterviewPrepModule } from './interview-prep/interview-prep.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ProfileModule, JobSeekerModule, JobModule, InterviewPrepModule, ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService, InterviewPrepService],
})
export class AppModule {}
