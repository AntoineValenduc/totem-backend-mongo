import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProfileDto } from '../../../totem-mongo/src/shared/dto/create-profile.dto';
import {PROFILE_PATTERNS} from "../../../totem-mongo/src/shared/constants/patterns";

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('TOTEM_MONGO_CLIENT') private profilesClient: ClientProxy,
  ) {}

  findAll() {
    return this.profilesClient.send(PROFILE_PATTERNS.FIND_ALL, {});
  }

  getById(id: string) {
    return this.profilesClient.send(PROFILE_PATTERNS.GET_BY_ID, id);
  }

  createProfile(profile: CreateProfileDto) {
    return this.profilesClient.send(PROFILE_PATTERNS.CREATE, profile);
  }
}
