import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { db } from '../db/client';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async register(
    email: string,
    password: string,
    username: string,
    role: string,
  ) {
    try {
      const hash = await bcrypt.hash(password, 10);

      await db.insert(user).values({
        email,
        password: hash,
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
        .from(user)
        .where(eq(user.email, email));
      if (!foundUser) throw new UnauthorizedException('Invalid credentials');

      const match = await bcrypt.compare(password, foundUser.password);
      if (!match) throw new UnauthorizedException('Invalid credentials');

      const token = await this.jwt.signAsync({
        sub: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
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

  async getUserFromToken(token: string) {
    try {
      const payload = await this.jwt.verifyAsync(token);
      const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, payload.sub));

      if (!foundUser) {
        throw new UnauthorizedException('User not found');
      }

      return foundUser;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
     }
}

}
