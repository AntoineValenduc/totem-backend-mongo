import { Body, Controller, Post } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { RegisterNewUserDto } from '../users/dto/register-from-invitation.dto';
import { MessagePattern } from '@nestjs/microservices';
import { USER_PATTERNS } from '../../../totem-mongo/src/shared/constants/patterns';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @MessagePattern(USER_PATTERNS.INVITATIONS_REGISTER)
  @Post('register')
  async registerFromToken(@Body() dto: RegisterNewUserDto) {
    return this.invitationsService.registerNewUser(dto);
  }
}