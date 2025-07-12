import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { registerSchema, loginSchema } from './dto/auth.dto';
import { AuthService } from './auth.service';
// import { JwtAuthGuard } from './jwt.guard';
@Controller('auth')
// @JwtAuthGuard()
// @UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    const parsed = registerSchema.parse(body);
    return this.auth.register(
      parsed.email,
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
}
