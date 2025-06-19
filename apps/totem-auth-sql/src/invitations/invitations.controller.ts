import { Body, Controller, Post } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { RegisterNewUserDto } from '../users/dto/register-from-invitation.dto';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @Post('register')
  async registerFromToken(@Body() dto: RegisterNewUserDto) {
    return this.invitationsService.registerNewUser(dto);
  }
}