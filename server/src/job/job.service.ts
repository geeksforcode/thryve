import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { jobs } from '../db/schema';
import { eq, ilike } from 'drizzle-orm';

@Injectable()
export class JobService {
  async create(jobData: any) {
    return db.insert(jobs).values(jobData).returning();
  }

  async findAll() {
    return db.select().from(jobs);
  }

  async matchJobsToSkills(skills: string[]) {
    const allJobs = await db.select().from(jobs);

    // Simple matching based on shared keywords
    const matched = allJobs.filter((job) => {
      const jobSkills = (job.skillsRequired as string[]) ?? [];
      return jobSkills.some((skill: string) =>
        skills.includes(skill.toLowerCase())
      );
    });

    return matched;
  }
}
