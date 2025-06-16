import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HttpService as LegacyHttpService } from '@nestjs/axios';

@Controller('api/invitations')
export class InvitationsProxyController {
  constructor(private readonly http: LegacyHttpService) {}

  @Post()
  create(@Body() body: any) {
    return this.http.axiosRef.post('http://totem-auth-sql:3002/invitations', body).then(res => res.data);
  }

  @Post('full')
  createFullInvitation(@Body() body: any) {
    return this.http.axiosRef.post('http://totem-auth-sql:3000/invitations/full', body).then(res => res.data);
  }

  @Get('validate')
  validate(@Query('token') token: string) {
    return this.http.axiosRef.get(`http://totem-auth-sql:3002/invitations/validate?token=${token}`).then(res => res.data);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.http.axiosRef.post('http://totem-auth-sql:3002/invitations/register', body).then(res => res.data);
  }
}