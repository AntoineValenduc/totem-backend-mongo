import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    console.log('[AuthService] DTO reçu:', dto);

    const user = await this.usersService.findByEmail(dto.email);
    console.log('[AuthService] Utilisateur trouvé par son email :', user);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      console.log(
        '[AuthService] Utilisateur non trouvé en comparant avec le password',
      );
      throw new UnauthorizedException('Identifiants invalides');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    console.log('[AuthService] Password match:', passwordMatch);

    if (!passwordMatch) {
      throw new UnauthorizedException('Password invalides');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}