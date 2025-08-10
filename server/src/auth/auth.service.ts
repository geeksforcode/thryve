import { Injectable, UnauthorizedException } from '@nestjs/common';
import { db } from '../db/client'; // adjust if different
import { user as userTable } from '../db/schema'; // drizzle schema
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Wrong credentials');

    return user;
  }

  async findByEmail(email: string) {
    const result = await db
      .select()
      .from(userTable)
      // .where(userTable.email.eq(email));
      .where(eq(userTable.email, email));
    return result[0];
  }

  async create(data: {
    email: string;
    username: string;
    password: string;
    role: string;
    provider?: string;
  }) {
    const result = await db.insert(userTable).values(data).returning();
    return result[0];
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateOAuthUser(profile: {
    email: string;
    username: string;
    provider: string;
  }) {
    let user = await this.usersService.findByEmail(profile.email);

    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        password: '', // Empty since it's OAuth
        role: 'user',
        username: profile.username,
      });
    }

    return user;
  }

  async validateOAuthLogin({
    email,
    username,
    provider,
  }: {
    email: string;
    username: string;
    provider: string;
  }) {
    // Check if user exists
    let user = await this.findByEmail(email);
    if (!user) {
      user = await this.create({
        email,
        username,
        password: '', // empty because it's OAuth
        role: 'user', // default role
        provider,
      });
    }

    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
