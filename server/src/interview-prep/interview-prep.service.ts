import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '../interview-prep/dto/create-question.dto';
// If you're using Drizzle & Supabase:
import { db } from '../db/client';
import { interviewQuestions } from '../db/schema';
import { eq } from 'drizzle-orm';


@Injectable()
export class InterviewPrepService {
  async createQuestion(dto: CreateQuestionDto) {
    return db.insert(interviewQuestions).values(dto).returning();
  }

  async getQuestionsByCategory(category: string) {
    return db
        .select()
        .from(interviewQuestions)
        .where(eq(interviewQuestions.category, category));
  }   
}
