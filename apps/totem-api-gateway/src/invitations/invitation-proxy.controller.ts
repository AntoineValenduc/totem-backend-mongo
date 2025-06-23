import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { HttpService as LegacyHttpService } from '@nestjs/axios';
import { RegisterNewUserDto } from '@totem-auth-sql/src/users/dto/register-from-invitation.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@totem-auth-sql/src/auth/guards/roles.guard';
import { Roles } from '@totem-auth-sql/src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@totem-auth-sql/src/auth/guards/jwt-auth.guard';

@ApiTags('invitations')
@Controller('api/invitations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'CHEF')
export class InvitationsProxyController {
  constructor(private readonly http: LegacyHttpService) {}

  @Post('register')
  async registerFromToken(@Body() body: RegisterNewUserDto) {
    return this.http.axiosRef
      .post('http://totem-auth-sql:3002/invitations/register', body)
      .then((res) => res.data);
  }
}
