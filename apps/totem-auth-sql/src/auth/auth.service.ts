import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { PROFILE_PATTERNS } from 'apps/totem-mongo/src/shared/constants/patterns';

interface UserSafe {
  id: string;
  email: string;
  password: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('TOTEM_MONGO_CLIENT') private readonly profilesClient: ClientProxy,
  ) {}

  async login(
    dto: LoginUserDto,
  ): Promise<{ access_token: string; role: string; user_id: string }> {
    console.log('[AuthService] DTO reçu:', dto);

    const user = (await this.usersService.findByEmail(
      dto.email,
    )) as unknown as UserSafe;
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const profile = await firstValueFrom(
      this.profilesClient.send(PROFILE_PATTERNS.GET_BY_USER_ID, {
        userId: user.id,
      }),
    );

    const payload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      sub: profile._id?.toString?.() ?? profile.id?.toString?.(),
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      user_id: user.id,
    };
  }
}
