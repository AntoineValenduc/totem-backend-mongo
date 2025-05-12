import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProfileService } from '../services/profile.service';
import { CreateProfileDto } from '../shared/dto/create-profile.dto';
import { PROFILE_PATTERNS } from '../shared/constants/patterns';
import { ProfileDocument } from '../schema/profile.schema';

@Controller()
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern(PROFILE_PATTERNS.FIND_ALL)
  async findAll(): Promise<ProfileDocument[]> {
    this.logger.log('✅ Requête reçue => findAll profiles MongoDB');
    return this.profileService.findAll();
  }

  @MessagePattern(PROFILE_PATTERNS.GET_BY_ID)
  async getById(@Payload('id') id: string): Promise<ProfileDocument> {
    if (!id) {
      this.logger.error('❌ Requête reçue => ID is required');
      throw new Error('❌ Requête reçue => ID is required');
    } else {
      this.logger.log(
        `✅ Requête reçue => getById profile MongoDB (ID: ${id})`,
      );
      return this.profileService.getById(id);
    }
  }

  @MessagePattern(PROFILE_PATTERNS.CREATE)
  async createProfile(
    @Payload() profileDto: CreateProfileDto,
  ): Promise<ProfileDocument> {
    this.logger.log('✅ Requête reçue => create profile MongoDB');
    return this.profileService.create(profileDto);
  }

  @MessagePattern(PROFILE_PATTERNS.UPDATE)
  async updateProfile(
    @Payload('id') id: string,
    @Payload() profileDto: CreateProfileDto,
  ): Promise<ProfileDocument> {
    this.logger.log(`✅ Requête reçue => update profile MongoDB (ID: ${id})`);
    return this.profileService.update(id, profileDto);
  }

  @MessagePattern(PROFILE_PATTERNS.DELETE)
  async removeProfile(@Payload('id') id: string): Promise<ProfileDocument> {
    this.logger.log(`✅ Requête reçue => remove profile MongoDB (ID: ${id})`);
    return this.profileService.remove(id);
  }
}
