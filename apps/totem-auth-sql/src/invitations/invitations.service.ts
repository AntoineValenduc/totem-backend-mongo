import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInvitationDto) {
    const token = uuidv4();
    return this.prisma.invitationToken.create({
      data: {
        email: dto.email,
        role: dto.role,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      },
    });
  }

  async validateToken(token: string) {
    const invitation = await this.prisma.invitationToken.findUnique({ where: { token } });
    if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
      throw new NotFoundException('Invitation invalide ou expirée');
    }
    return invitation;
  }

  async markAsUsed(token: string) {
    return this.prisma.invitationToken.update({
      where: { token },
      data: { used: true },
    });
  }
}