import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HttpService as LegacyHttpService } from '@nestjs/axios';
import { RegisterNewUserDto } from '../../../totem-auth-sql/src/users/dto/register-from-invitation.dto';

@Controller('api/invitations')
export class InvitationsProxyController {
  constructor(private readonly http: LegacyHttpService) {}

  @Post('register')
  async registerFromToken(@Body() body: RegisterNewUserDto) {
    return this.http.axiosRef.post('http://totem-auth-sql:3002/invitations/register', body).then(res => res.data);
  }

}