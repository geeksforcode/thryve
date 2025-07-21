import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { user as userTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    const [u] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));
    return u;
  }

  async create(data: {
    email: string;
    username: string;
    password: string;
    role: string;
  }) {
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : '';

    const [newUser] = await db
      .insert(userTable)
      .values({
        email: data.email,
        password: hashedPassword,
        role: data.role,
        username: data.username,
      })
      .returning();

    return newUser;
  }
}
