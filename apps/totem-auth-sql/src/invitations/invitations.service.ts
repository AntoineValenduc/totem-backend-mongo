import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from '../../../totem-mongo/src/services/profile.service';
import { RegisterNewUserDto } from '../users/dto/register-from-invitation.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';
import { generateTempPassword } from '../utils/password.utils';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../utils/mail.service';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registerNewUser(dto: RegisterNewUserDto) {
    const tempPassword = generateTempPassword(); // 8-10 caractères
    const hashed = await bcrypt.hash(tempPassword, 10);

    // Création User (PostgreSQL)
    const user = await this.prisma.user.create({
      data: {
        email: dto.mail,
        password: hashed,
        tempPassword: tempPassword,
        role: dto.role as Role,
        isFirstLogin: true,
      },
    });

    // Création du Profile Mongo, avec liaison de son Id SQL
    await this.profileService.create({
      ...dto,
      user_id: user.id.toString(),
      date_of_birth: new Date(dto.date_of_birth) // obligation de le respécifier
    });

    // Générer un JWT temporaire
    const token = this.jwtService.sign(
      { sub: user.id, purpose: 'first-login' },
      { expiresIn: '2d' }
    );

    // Envoyer un mail avec le token + mot de passe temporaire
    await this.mailService.sendInvitation(user.email, tempPassword, token);

    return { message: 'Invitation envoyée', token };
  }
}
