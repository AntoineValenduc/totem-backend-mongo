import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../../../totem-auth-sql/src/users/dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthProxyController {
  constructor(private readonly httpService: HttpService) {}

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

      const setCookie = response.headers?.['set-cookie'];
      if (setCookie) {
        res.setHeader('Set-Cookie', setCookie);
      }

      return response.data;
    } catch (err) {
      console.error('Erreur de proxy login:', err.response.data);
      res.status(500);
      return { success: false, message: 'Erreur lors de la connexion' };
    }
  }
}
