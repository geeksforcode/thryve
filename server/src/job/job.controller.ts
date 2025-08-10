import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Body() body: any) {
    return this.jobService.create(body);
  }

  @Get()
  findAll() {
    return this.jobService.findAll();
  }
}
