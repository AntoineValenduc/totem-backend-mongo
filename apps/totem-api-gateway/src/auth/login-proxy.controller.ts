import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly httpService: HttpService) {}

  @Post('login')
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
