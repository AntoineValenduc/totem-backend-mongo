import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(userId: string, username: string) {
    const payload = {
      sub: userId,
      username: username,
    };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}