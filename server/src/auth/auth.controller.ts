import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return { msg: 'Redirecting to Google...' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req, @Res() res: Response) {
    const token = await this.authService.login(req.user);
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
    const token = await this.authService.login(req.user);
    res.redirect(
      `http://localhost:3000/auth-success?token=${token.access_token}`,
    );
  }
}
