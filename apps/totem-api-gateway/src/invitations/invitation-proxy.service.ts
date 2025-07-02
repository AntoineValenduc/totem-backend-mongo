import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RegisterNewUserDto } from '../../../totem-auth-sql/src/users/dto/register-from-invitation.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InvitationProxyService {
  constructor(private readonly http: HttpService) {}

  async registerNewUser(dto: RegisterNewUserDto) {
    try {
      const response$ = this.http.post(
        'http://localhost:3002/invitations/register',
        dto,
        { withCredentials: true },
      );
      const res = await lastValueFrom(response$);
      return res.data;
    } catch (error) {
      console.error('Erreur proxy invitation:', error?.response?.data || error);
      throw error;
    }
  }
}
