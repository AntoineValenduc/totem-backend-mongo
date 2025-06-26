import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ProfileService } from '../services/profile.service';
import { ProfileCreateDto } from '../shared/dto/profile-create.dto';
import { PROFILE_PATTERNS } from '../shared/constants/patterns';
import { ProfileDocument } from '../schema/profile.schema';
import { ProfileUpdateDto } from '../shared/dto/profile-update.dto';
import { ProfileBadgeDto } from '../shared/dto/profileBadge.dto';

@Controller()
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern(PROFILE_PATTERNS.FIND_ALL)
  async findAll(): Promise<ProfileDocument[]> {
    this.logger.log('✅ Requête reçue => findAll profiles MongoDB');
    return await this.profileService.findAll();
  }

  @MessagePattern(PROFILE_PATTERNS.FIND_ALL_SOFT_DELETED)
  async findAllSoftDeleted(): Promise<ProfileDocument[]> {
    this.logger.log(
      '✅ Requête reçue => findAll profiles soft-deleted MongoDB',
    );
    return this.profileService.findAllSoftDeleted();
  }

  @MessagePattern(PROFILE_PATTERNS.FIND_ALL_BY_BRANCH)
  async getProfilesByBranch(
    @Payload('branchId') branchId: string,
  ): Promise<ProfileDocument[]> {
    this.logger.log(
      `✅ Requête reçue => getProfilesByBranch MongoDB (branchId: ${branchId})`,
    );
    if (!branchId) {
      this.logger.error('❌ Requête reçue => branchId is required');
      throw new RpcException('Branch ID requis');
    }
    try {
      return await this.profileService.getProfilesByBranch(branchId);
    } catch (error) {
      console.error('❌ Erreur dans getProfilesByBranch:', error);
      const message =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message?: string }).message
          : undefined;
      throw new RpcException(message ?? 'Erreur interne microservice');
    }
  }

  @MessagePattern(PROFILE_PATTERNS.GET_BY_ID)
  async getById(@Payload('id') id: string): Promise<ProfileDocument> {
    this.logger.log(`✅ Requête reçue => getById profile MongoDB (ID: ${id})`);
    if (!id) {
      this.logger.error('❌ Requête reçue => ID is required');
      throw new Error('❌ Requête reçue => ID is required');
    } else {
      try {
        return await this.profileService.getById(id);
      } catch (error) {
        console.error('❌ Erreur dans getById:', error);
        const message =
          error && typeof error === 'object' && 'message' in error
            ? (error as { message?: string }).message
            : undefined;
        throw new RpcException(message ?? 'Erreur interne microservice');
      }
    }
  }

  @MessagePattern(PROFILE_PATTERNS.GET_BY_USER_ID)
  async getByUserId(@Payload() data: { userId: string }) {
    const userId = data.userId;
    this.logger.log(
      `✅ Requête reçue => getByUserId profile MongoDB (userId: ${userId})`,
    );
    if (!userId) {
      this.logger.error('❌ Requête reçue => userId is required');
      throw new RpcException('userId requis');
    }
    try {
      const profile = await this.profileService.getByUserId(userId);
      return profile?.toObject ? profile.toObject() : profile;
    } catch (error) {
      console.error('❌ Erreur dans getByUserId:', error);
      const message =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message?: string }).message
          : undefined;
      throw new RpcException(message ?? 'Erreur interne microservice');
    }
  }

  @MessagePattern(PROFILE_PATTERNS.CREATE)
  async createProfile(
    @Payload() profileDto: ProfileCreateDto,
  ): Promise<ProfileDocument> {
    this.logger.log('✅ Requête reçue => create profile MongoDB');
    return this.profileService.create(profileDto);
  }

  @MessagePattern(PROFILE_PATTERNS.UPDATE)
  async updateProfile(
    @Payload() data: { id: string; profile: ProfileUpdateDto },
  ): Promise<ProfileDocument> {
    const { id, profile } = data;
    this.logger.log(`✅ Requête reçue => update profile MongoDB (ID: ${id})`);
    this.logger.log(
      `✅ Requête reçue => update profile MongoDB (Payload: ${JSON.stringify(profile)})`,
    );
    return this.profileService.update(id, profile);
  }

  @MessagePattern(PROFILE_PATTERNS.DELETE)
  async removeProfile(@Payload('id') id: string): Promise<ProfileDocument> {
    if (!id) {
      this.logger.error('❌ Requête reçue => ID is required');
      throw new Error('❌ Requête reçue => ID is required');
    }
    try {
      return await this.profileService.removeSoft(id);
    } catch (error) {
      console.error('❌ Erreur dans removeProfile:', error);
      const message =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message?: string }).message
          : undefined;
      throw new RpcException(message ?? 'Erreur interne microservice');
    }
  }

  @MessagePattern(PROFILE_PATTERNS.UPDATE_BADGES)
  async addBadgeToProfile(
    @Payload()
    data: {
      profileId: string;
      profileBadge: ProfileBadgeDto;
    },
  ): Promise<ProfileDocument> {
    const { profileId, profileBadge } = data;
    this.logger.log(
      `✅ Requête reçue => updateBadgeProfile MongoDB (profileId: ${profileId}, et profileBadge: ${JSON.stringify(profileBadge)})`,
    );
    if (!profileId) {
      this.logger.error(
        '❌ Requête reçue => profileId and badgeId are required',
      );
      throw new RpcException('profileId et badgeId requis');
    }
    return this.profileService.addBadgeToProfile(profileId, profileBadge);
  }
}
