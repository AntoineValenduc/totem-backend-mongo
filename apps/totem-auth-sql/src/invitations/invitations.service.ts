import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from '@totem-mongo/src/services/profile.service';
import { RegisterNewUserDto } from '../users/dto/register-from-invitation.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';
import { generateTempPassword } from '../utils/password.utils';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
    private readonly emailService: MailService,
  ) {}

  /**
   * Enregistrement nouvel User (SQL) + Profile (MONGO)
   * @param dto
   */
  async registerNewUser(dto: RegisterNewUserDto) {
    console.log('DTO reçu', dto);
    if (!dto.email) {
      throw new BadRequestException('Email manquant');
    }

    // Vérifie eemail déjà existant
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException(`L'email ${dto.email} est déjà utilisé.`);
    }

    // Génète mdt temp
    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);

    // Crée User (SQL)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        tempPassword: tempPassword,
        role: dto.role as Role,
        isFirstLogin: true,
      },
    });

    // Crée Profil (MONGO), avec liaison Id User (SQL)
    try {
      await this.profileService.create({
        ...dto,
        user_id: user.id.toString(),
        date_of_birth: new Date(dto.date_of_birth), // obligation de le respécifier
      });
    } catch (err) {
      console.error(err);
      throw err;
    }

    // Génère Token JWT unique pour la session first-login (premier login avec création premier mdp)
    const token = this.jwtService.sign(
      { sub: user.id, purpose: 'first-login' },
      { expiresIn: '2d' },
    );

    // Envoi du email avec Token + mdp temp
    await this.emailService.sendInvitation(user.email, tempPassword, token);

    return { message: 'Invitation envoyée', token };
  }
}
