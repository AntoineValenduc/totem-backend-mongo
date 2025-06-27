import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(dto);
    const result: { access_token: string; role: string; user_id: string } =
      await this.authService.login(dto);
    const { access_token, role, user_id } = result;
    console.log('[Gateway] Token JWT généré:', access_token);
    res.cookie('jwt', access_token, { httpOnly: true });
    return {
      success: true,
      access_token: access_token,
      role: role,
      user_id: user_id,
      message: 'Connexion réussie',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(
    @Req() req: { user: { email: string; role: string; user_id: string } },
  ) {
    const user = req.user;
    return {
      email: user.email,
      role: user.role,
      user_id: user.user_id,
    };
  }
}
