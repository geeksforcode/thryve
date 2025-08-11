import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { db } from '../db/client';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    username: string,
    role: string,
  ) {
    try {
      const hash = await bcrypt.hash(password, 10);

      await db.insert(users).values({
        email,
        password: hash,
        firstName,
        lastName,
        username,
        role,
      });

      return { message: 'User created' };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async login(email: string, password: string) {
    try {
      const [foundUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (!foundUser) throw new UnauthorizedException('Invalid credentials');

      const match = await bcrypt.compare(password, foundUser.password);
      if (!match) throw new UnauthorizedException('Invalid credentials');

      const token = await this.jwt.signAsync({
        sub: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
      });

      return { access_token: token };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }

  async validateOAuthUser({
    email,
    username,
    provider,
  }: {
    email: string;
    username: string;
    provider: string;
  }): Promise<any> {
    // Implement your logic: Check if the user exists, create one, etc.
    // Example:
    const user = { email, username, provider };
    return user;
  }
  // This method is used in FacebookStrategy
  async validateOAuthLogin({
    email,
    username,
    provider,
  }: {
    email: string;
    username: string;
    provider: string;
  }): Promise<any> {
    // Implement your logic: Check if the user exists, create one, etc.
    // Example:
    const user = { email, username, provider };
    return user;
  }
}
