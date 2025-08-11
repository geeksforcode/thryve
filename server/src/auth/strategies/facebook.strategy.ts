import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['emails', 'name', 'displayName'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    const email =
      profile.emails?.[0].value || `no-email-${Date.now()}@facebook.com`;

    await this.authService.validateOAuthLogin({
      email,
      username: profile.displayName,
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
