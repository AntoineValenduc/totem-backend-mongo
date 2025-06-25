/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../../../totem-auth-sql/src/users/dto/login-user.dto';
import { ProfilesService } from '../profiles/profiles.service';

@ApiTags('auth')
@Controller('auth')
export class AuthProxyController {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly profileService: ProfilesService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Authentification via proxy microservice PostgreSQL (TOTEM-AUTH-SQL)',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentification réussie',
    type: LoginUserDto,
  })
  @ApiResponse({ status: 404, description: 'Identifiants incorrects' })
  @ApiResponse({ status: 500, description: 'Erreur lors de la connexion' })
  async proxyLogin(
    @Body() body: Record<string, unknown>,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('[Gateway] login payload:', body);
    try {
      type AuthResponse = {
        access_token?: string;
        role?: string;
      };
      const response = await firstValueFrom(
        this.httpService.post<AuthResponse>('http://localhost:3002/auth/login', body, {
          withCredentials: true,
        }),
      );

      const data: AuthResponse = response.data ?? {};
      const access_token: string | undefined = data.access_token;
      if (!access_token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Token JWT manquant dans la réponse du microservice auth.',
        });
      }

      res.cookie('jwt', access_token, {
        httpOnly: true,
        secure: false, // mettre true en prod (HTTPS)
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      return {
        message: 'Connexion réussie',
        role: data.role ?? null,
      };
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      console.error(
        '[Gateway] Erreur de proxy login:',
        error?.response?.data ?? error?.message,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erreur lors de la connexion au microservice auth.',
      });
    }
  }

  @Get('/me')
  async getMe(@Req() req: { cookies?: Record<string, string> }, @Res() res: Response) {
    try {
      const token: string | undefined = req.cookies?.jwt;
      console.log('[Gateway] Token reçu dans le cookie :', req.cookies?.jwt);

      if (!token) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Non authentifié' });
      }

      type JwtPayload = { sub: string, email?: string; role?: string };
      const payload: JwtPayload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET as string,
      });
      const userId = payload.sub;

      console.log('[Gateway] Payload du JWT:', payload);

      /**
       * Recherche de l'utilisateur Mongo
       */
     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
     const profile = await firstValueFrom(this.profileService.getByUserId(userId));

      console.log('[Gateway] Profil utilisateur récupéré:', profile);

      return res.status(200).json({
        ...profile,
        email: payload.email ?? null,
        role: payload.role ?? null,
      });
    } catch (err: unknown) {
      console.error('[Gateway] Erreur dans /api/me :', err);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Token invalide' });
    }
  }
}
