import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { jobSeekers } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateJobSeekerDto } from './dto/create-jobseeker.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from '../interview-prep/dto/create-question.dto';
import { questions } from '../db/schema';

@Injectable()
export class JobSeekerService {
  async create(data: CreateJobSeekerDto & { userId?: string }) {
    return db.insert(jobSeekers).values(data).returning();
  }

  async findAll() {
    return db.select().from(jobSeekers);
  }

  async findOne(id: number) {
    return db.select().from(jobSeekers).where(eq(jobSeekers.id, id));
  }

  async findByUserId(userId: string) {
    const [seeker] = await db
      .select()
      .from(jobSeekers)
      .where(eq(jobSeekers.userId, userId));

    return seeker;
  }

  async updateResume(id: number, dto: UpdateResumeDto) {
    const [existing] = await db
      .select()
      .from(jobSeekers)
      .where(eq(jobSeekers.id, id));

    if (!existing) {
      throw new NotFoundException('Job seeker not found');
    }

    return db
      .update(jobSeekers)
      .set({
        bio: dto.bio,
        resumeUrl: dto.resumeUrl,
        skills: dto.skills,
        education: dto.education,
        experience: dto.experience,
      })
      .where(eq(jobSeekers.id, id))
      .returning();
  }
}

@Injectable()
export class InterviewPrepService {
  async getQuestionsByCategory(category: string) {
    return db.select().from(questions).where(eq(questions.category, category));
  }

  async createQuestion(dto: CreateQuestionDto) {
    return db.insert(questions).values(dto).returning();
  }
}
