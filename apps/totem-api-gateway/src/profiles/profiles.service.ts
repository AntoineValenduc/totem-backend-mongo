import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProfileCreateDto } from 'totem-mongo/src/shared/dto/profile-create.dto';
import { PROFILE_PATTERNS } from 'totem-mongo/src/shared/constants/patterns';
import { firstValueFrom } from 'rxjs';
import { ProfileUpdateDto } from 'totem-mongo/src/shared/dto/profile-update.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('TOTEM_MONGO_CLIENT') private readonly profilesClient: ClientProxy,
  ) {}

  findAll() {
    return this.profilesClient.send(PROFILE_PATTERNS.FIND_ALL, {});
  }

  findAllSoftDeleted() {
    return this.profilesClient.send(PROFILE_PATTERNS.FIND_ALL_SOFT_DELETED, {});
  }

  getById(id: string) {
    return this.profilesClient.send(PROFILE_PATTERNS.GET_BY_ID, { id });
  }

  async createProfile(profile: ProfileCreateDto) {
    return await firstValueFrom(
      this.profilesClient.send(PROFILE_PATTERNS.CREATE, profile)
    );
  }

  async updateProfile(id: string, profile: ProfileUpdateDto) {
    return await firstValueFrom(
      this.profilesClient.send(PROFILE_PATTERNS.UPDATE, { id, profile: profile })
    );
  }

  async deleteProfile(id: string) {
    return await firstValueFrom(
      this.profilesClient.send(PROFILE_PATTERNS.DELETE, { id })
    );
  }
}
