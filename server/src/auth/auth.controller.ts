import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { registerSchema } from './dto/auth.dto';
import { loginSchema } from './dto/auth.dto';
import { Response, Request } from 'express';
interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    const parsed = registerSchema.parse(body);
    return this.auth.register(
      parsed.email,
      parsed.lastName,
      parsed.firstName,
      parsed.password,
      parsed.username,
      parsed.role,
    );
  }

  @Post('login')
  login(@Body() body: any) {
    const parsed = loginSchema.parse(body);
    return this.auth.login(parsed.email, parsed.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return { msg: 'Redirecting to Google...' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req, @Res() res: Response) {
    const token = await this.auth.loginOAuth(req.user);
    res.redirect(
      `http://localhost:3000/auth-success?token=${token.access_token}`,
    );
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    return { msg: 'Redirecting to Facebook...' };
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req, @Res() res: Response) {
    const token = await this.auth.loginOAuth(req.user);
    res.redirect(
      `http://localhost:3000/auth-success?token=${token.access_token}`,
    );
  }
}
