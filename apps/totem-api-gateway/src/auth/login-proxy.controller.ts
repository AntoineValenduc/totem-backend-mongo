import { Controller, Post, Body, Res, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '@totem-auth-sql/src/users/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthProxyController {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authentification via proxy microservice PostgreSQL (TOTEM-AUTH-SQL)'})
  @ApiResponse({ status: 200, description: 'Authentification réussie', type: LoginUserDto})
  @ApiResponse({ status: 404, description: 'Identifiants incorrects' })
  @ApiResponse({ status: 500, description: 'Erreur lors de la connexion' })
  async proxyLogin(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    console.log('[Gateway] login payload:', body);
    try {
      const response = await firstValueFrom(
        this.httpService.post<any>('http://localhost:3002/auth/login', body, {
          withCredentials: true,
        })
      );

      const access_token = response.data?.access_token;
      if (!access_token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Token JWT manquant dans la réponse du microservice auth.',
        });
      }

      res.cookie('jwt', response.data?.access_token, {
        httpOnly: true,
        secure: false, // mettre true en prod (HTTPS)
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      return {
        message: 'Connexion réussie',
        role: response.data?.role,
      };
    } catch (err) {
      console.error('[Gateway] Erreur de proxy login:', err?.response?.data ?? err.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Erreur lors de la connexion' });
    }
  }

  @Get('me')
  async getMe(@Req() req: any, @Res() res: Response) {
    try {
      const token = req.cookies?.jwt;
      console.log('[Gateway] Token reçu dans le cookie :', req.cookies?.jwt);

      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Non authentifié' });
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return res.status(200).json({
        email: payload.email,
        role: payload.role,
      });
    } catch (err) {
      console.error('[Gateway] Erreur dans /api/me :', err);
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token invalide' });
    }
  }
}
