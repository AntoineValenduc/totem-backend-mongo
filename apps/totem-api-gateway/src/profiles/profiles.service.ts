import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PROFILE_PATTERNS } from '../../../totem-mongo/src/shared/constants/patterns';
import { ProfileCreateDto } from '../../../totem-mongo/src/shared/dto/profile-create.dto';
import { ProfileUpdateDto } from '../../../totem-mongo/src/shared/dto/profile-update.dto';
import { ProfileBadgeDto } from 'apps/totem-mongo/src/shared/dto/profileBadge.dto';

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

  findAllByBranch(branchId: string) {
    return this.profilesClient.send(PROFILE_PATTERNS.FIND_ALL_BY_BRANCH, {
      branchId,
    });
  }

  getById(id: string) {
    return this.profilesClient.send(PROFILE_PATTERNS.GET_BY_ID, { id });
  }

  getByUserId(userId: string) {
    return this.profilesClient.send(PROFILE_PATTERNS.GET_BY_USER_ID, {
      userId,
    });
  }

  async createProfile(profile: ProfileCreateDto): Promise<ProfileCreateDto> {
    return await firstValueFrom<ProfileCreateDto>(
      this.profilesClient.send(PROFILE_PATTERNS.CREATE, profile),
    );
  }

  async updateProfile(
    id: string,
    profile: ProfileUpdateDto,
  ): Promise<ProfileUpdateDto> {
    return await firstValueFrom<ProfileUpdateDto>(
      this.profilesClient.send(PROFILE_PATTERNS.UPDATE, {
        id,
        profile: profile,
      }),
    );
  }

  async deleteProfile(id: string): Promise<{ deleted: boolean }> {
    return await firstValueFrom<{ deleted: boolean }>(
      this.profilesClient.send(PROFILE_PATTERNS.DELETE, { id }),
    );
  }

  async addBadgeToProfile(
    profileId: string,
    profileBadge: ProfileBadgeDto,
  ): Promise<ProfileBadgeDto> {
    return await firstValueFrom<ProfileBadgeDto>(
      this.profilesClient.send(PROFILE_PATTERNS.UPDATE_BADGES, {
        profileId,
        profileBadge: profileBadge,
      }),
    );
  }
}
