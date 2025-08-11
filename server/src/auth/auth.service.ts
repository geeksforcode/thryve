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
// import * as jwt from 'jsonwebtoken';
interface OAuthUser {
  provider: 'google' | 'facebook';
  emails: { value: string }[];
  displayName: string;
  // Add other properties as needed
}
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
    const user = { email, username, provider };
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
  }): Promise<any> {
    // Implement your logic: Check if the user exists, create one, etc.
    const user = { email, username, provider };
    return user;
  }
  // New OAuth login method with a distinct name
  async loginOAuth(oAuthUser: OAuthUser): Promise<{ access_token: string }> {
    let user;
    if (oAuthUser.provider === 'google') {
      // Use optional chaining: oAuthUser.emails?.[0]?.value
      user = await this.validateOAuthUser({
        email: oAuthUser.emails?.[0]?.value,
        username: oAuthUser.displayName,
        provider: 'google',
      });
    } else if (oAuthUser.provider === 'facebook') {
      user = await this.validateOAuthLogin({
        email: oAuthUser.emails?.[0]?.value,
        username: oAuthUser.displayName,
        provider: 'facebook',
      });
    } else {
      throw new Error('Unknown OAuth provider');
    }
    const payload = { email: user.email, provider: user.provider };
    const access_token = await this.jwt.signAsync(payload, { expiresIn: '1h' });
    return { access_token };
  }
}
