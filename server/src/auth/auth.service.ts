import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { db } from '../db/client';
import { users } from '../db/schema';
import { user as userTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { newProfiles } from './profile';
// import * as jwt from 'jsonwebtoken';
interface OAuthUser {
  provider: 'google' | 'facebook';
  emails: { value: string }[];
  displayName: string;
  photos?: { value: string }[];
}
// employer same as company
// const roles = ['job-seeker', 'artist', 'investor', 'employer'];
@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async validateOauthUser(payload: {
    email: string;
    username: string;
    picture?: string;
    provider: 'google' | 'facebook';
  }) {
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, payload.email))
      .limit(1);

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    // Create new User
    const [newUser] = await db
      .insert(userTable)
      .values({
        email: payload.email,
        username: payload.username,
        role: 'user',
        password: '',
      })
      .returning();

    return newUser;
  }
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

      const newUser = await db.transaction(async (tx) => {
        const [usr] = await tx
          .insert(users)
          .values({
            email,
            password: hash,
            firstName,
            lastName,
            username,
            role,
          })
          .returning();
        const full_name = `${usr.firstName} ${usr.lastName}`;
        try {
          await newProfiles(usr.role, usr.id, usr.email, full_name);
        } catch (err: unknown) {
          if (err instanceof Error) {
            throw new InternalServerErrorException(err.message);
          }
          throw new InternalServerErrorException(
            'Something went wrong during registration',
          );
        }
        const { password, ...safeUser } = usr;
        return safeUser;
      });
      return { message: 'User created', newUser };
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
    picture,
  }: {
    email: string;
    username: string;
    provider: string;
    picture?: string;
  }): Promise<any> {
    // Implement your logic: Check if the user exists, create one, etc.
    const user = { email, username, provider, picture };
    return user;
  }
  async validateOAuthLogin({
    email,
    username,
    provider,
    picture,
  }: {
    email: string;
    username: string;
    provider: string;
    picture?: string;
  }): Promise<any> {
    // Implement your logic: Check if the user exists, create one, etc.
    const user = { email, username, provider, picture };
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
        picture: oAuthUser.photos?.[0]?.value,
      });
    } else {
      throw new Error('Unknown OAuth provider');
    }
    const payload = { email: user.email, provider: user.provider };
    const access_token = await this.jwt.signAsync(payload, { expiresIn: '1h' });
    return { access_token };
  }
}
