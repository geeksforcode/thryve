import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { db } from '../db/client';
import { users as userTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { newProfiles } from './profile';

interface OAuthUser {
  provider: 'google' | 'facebook';
  emails: { value: string }[];
  displayName: string;
  photos?: { value: string }[];
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

      const newUser = await db.transaction(async (tx) => {
        const [usr] = await tx
          .insert(userTable)
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
        .from(userTable)
        .where(eq(userTable.email, email));

      if (!foundUser) throw new UnauthorizedException('Invalid credentials');

      const match = await bcrypt.compare(password, foundUser.password);
      if (!match) throw new UnauthorizedException('Invalid credentials');

      const token = await this.signJwt(foundUser);

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
  email?: string;
  username: string;
  provider: string;
  picture?: string;
}): Promise<any> {
  const safeEmail =
    email && email.trim().length > 0
      ? email
      : `${provider}_${Date.now()}@${provider}.com`;
    
   if (!email) {
    email = `${provider}_${Date.now()}@noemail.com`;
  }

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // Split username into first/last name safely
  const displayName = username || `user_${Date.now()}`;
  const [firstName, ...rest] = displayName.split(" ");
  const lastName = rest.join(" ") || provider;

  // Create new OAuth user with defaults
  const [newUser] = await db
    .insert(userTable)
    .values({
      email: safeEmail,
      username: displayName,
      role: "jobseeker",
      password: "oauth",
      firstName: firstName || "OAuth",
      lastName: lastName || "User",
      provider,
    })
    .returning();

  return newUser;
}



  async loginOAuth(oAuthUser: OAuthUser): Promise<{ access_token: string }> {
    let user;

    if (oAuthUser.provider === 'google') {
      user = await this.validateOAuthUser({
        email: oAuthUser.emails?.[0]?.value,
        username: oAuthUser.displayName,
        provider: 'google',
      });
    } else if (oAuthUser.provider === 'facebook') {
      user = await this.validateOAuthUser({
        email: oAuthUser.emails?.[0]?.value,
        username: oAuthUser.displayName,
        provider: 'facebook',
        picture: oAuthUser.photos?.[0]?.value,
      });
    } else {
      throw new Error('Unknown OAuth provider');
    }

    const token = await this.signJwt(user);

    return { access_token: token };
  }

  private async signJwt(user: any): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        provider: user.provider,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: '1h' },
    );
  }
}
