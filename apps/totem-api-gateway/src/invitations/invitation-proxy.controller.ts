import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { HttpService as LegacyHttpService } from '@nestjs/axios';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../totem-auth-sql/src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../totem-auth-sql/src/auth/guards/roles.guard';
import { Roles } from '../../../totem-auth-sql/src/auth/decorators/roles.decorator';
import { RegisterNewUserDto } from '../../../totem-auth-sql/src/users/dto/register-from-invitation.dto';
import { InvitationProxyService } from './invitation-proxy.service';

@ApiTags('invitations')
@Controller('invitations')
//@UseGuards(JwtAuthGuard, RolesGuard)
//@Roles('ADMIN', 'CHEF')
export class InvitationsProxyController {
  constructor(private readonly invitationProxyService: InvitationProxyService) {}

  @Post('/register')
  async registerFromToken(@Body() body: RegisterNewUserDto) {
    return this.invitationProxyService.registerNewUser(body);
  }
}
