import { Controller, Post, Body, Get, Patch, Param, UseGuards, Req,  NotFoundException } from '@nestjs/common';
import { JobSeekerService } from './jobseeker.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CreateJobSeekerDto } from './dto/create-jobseeker.dto';
import { JobService } from '../job/job.service';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InterviewPrepService } from '../interview-prep/interview-prep.service'; 
import { CreateQuestionDto } from '../interview-prep/dto/create-question.dto'; 


@Controller('job-seekers')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService,  private readonly jobService: JobService) {}

  // 🔐 Protect route with JwtAuthGuard
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateJobSeekerDto, @Req() req: any) {
    // You can access the user like this
    const user = req.user;
    return this.jobSeekerService.create({ ...body, userId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.jobSeekerService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobSeekerService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('matches')
  async getMatches(@Req() req: any) {
    const seeker = await this.jobSeekerService.findByUserId(req.user.id);

    if (!seeker) {
      throw new NotFoundException('Job seeker profile not found');
    }

    const skills = Array.isArray(seeker.skills) ? seeker.skills : [];
    return this.jobService.matchJobsToSkills(skills.map((s) => s.toLowerCase()));
  } 

  @UseGuards(JwtAuthGuard)
  @Patch(':id/resume')
  updateResume(@Param('id') id: string, @Body() dto: UpdateResumeDto) {
    return this.jobSeekerService.updateResume(Number(id), dto);
  } 
}

@Controller('interview-prep')
export class InterviewPrepController {
 constructor(
    private readonly jobSeekerService: JobSeekerService,
    private readonly interviewPrepService: InterviewPrepService,
  ) {}

  @Get(':category')
  getByCategory(@Param('category') cat: string) {
    return this.interviewPrepService.getQuestionsByCategory(cat);
  }

  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.interviewPrepService.createQuestion(dto);
  }
}



