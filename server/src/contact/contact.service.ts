import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { contactMessages } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ContactService {
  async sendMessage(dto: { name: string; email: string; message: string }) {
    const [msg] = await db.insert(contactMessages).values(dto).returning();
    return msg;
  }

  async findAll() {
    return db.select().from(contactMessages);
  }

  async findOne(id: number) {
    const [msg] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id));
    return msg;
  }
}
