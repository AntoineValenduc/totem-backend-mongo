import { Controller, Post, Body, Res, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: any) {
    console.log(dto);
    const { access_token, role } = await this.authService.login(dto);
    res.cookie('jwt', access_token, { httpOnly: true });
    return {
      success: true,
      access_token: access_token,
      role: role,
    };
  }


  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    const user = req.user;
    return {
      email: user['email'],
      role: user['role'],
    };
  }
}