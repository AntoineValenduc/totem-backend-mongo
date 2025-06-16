import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateFullInvitationDto } from './dto/create-full-invitation.dto';
import { HttpService } from '@nestjs/axios';
import { Role } from '../common/enums/role.enum';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly httpService: HttpService
  ) {}

  @Post()
  async create(@Body() dto: CreateInvitationDto) {
    return this.invitationsService.create(dto);
  }

  @Get(':token')
  async validate(@Param('token') token: string) {
    return this.invitationsService.validateToken(token);
  }

  @Roles('CHEF')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('full')
  async createFull(@Body() body: CreateFullInvitationDto) {
    await this.httpService.axiosRef.post('http://totem-mongo:3002/profiles', body.profile);
    const invitation = await this.invitationsService.create({ email: body.email, role: Role.JEUNE });
    return { success: true, token: invitation.token };
  }
}