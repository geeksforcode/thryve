import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      scope: ['public_profile', 'email'],
      profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email =
      profile.emails?.[0].value || `no-email-${Date.now()}@facebook.com`;

    await this.authService.validateOAuthUser({
      email,
      username: profile.displayName,
      picture: (profile as any).photos?.[0]?.value,
      provider: 'facebook',
    });

    done(null, {
      accessToken,
      profile: {
        id: profile.id,
        email: profile.emails?.[0].value,
        username: profile.displayName,
      },
    });
  }
}
