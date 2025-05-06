import { Controller, Param } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProfileDto } from '../shared/dto/create-profile.dto';
import {PROFILE_PATTERNS} from "../shared/constants/patterns";

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern(PROFILE_PATTERNS.FIND_ALL)
  async findAll() {
    console.log('✅ Requête reçue => findAll profile MongoDB');
    return this.profileService.findAll();
  }

  @MessagePattern(PROFILE_PATTERNS.GET_BY_ID)
  async getById(@Payload() id: string) {
    console.log('✅ Requête reçue => getById profile MongoDB');
    return this.profileService.getById(id);
  }

  @MessagePattern(PROFILE_PATTERNS.CREATE)
  async createProfile(profileDto: CreateProfileDto) {
    console.log('✅ Requête reçue => create profile MongoDB');
    return this.profileService.create(profileDto);
  }
}
