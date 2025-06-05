import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { CreateProfileDto } from 'totem-mongo/src/shared/dto/create-profile.dto';
import { PROFILE_PATTERNS } from 'totem-mongo/src/shared/constants/patterns';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('TOTEM_MONGO_CLIENT') private readonly profilesClient: ClientProxy,
    //@Inject('KAFKA_SERVICE') private readonly kafkaProducer: ClientKafka,
  ) {}

  findAll() {
    return this.profilesClient.send(PROFILE_PATTERNS.FIND_ALL, {});
  }

  getById(id: string) {
    return this.profilesClient.send(PROFILE_PATTERNS.GET_BY_ID, { id });
  }

  async createProfile(profile: CreateProfileDto) {
    const result = await firstValueFrom(
      this.profilesClient.send(PROFILE_PATTERNS.CREATE, profile)
    );

    /*this.kafkaProducer.emit('profile-created', {
      event: 'ProfileCreated',
      timestamp: new Date(),
      data: result,
    });*/

    return result;
  }

  async updateProfile(idProfile: string, profile: CreateProfileDto) {
    const result = await firstValueFrom(
      this.profilesClient.send(PROFILE_PATTERNS.UPDATE, [idProfile, profile])
    );

    /*this.kafkaProducer.emit('profile-updated', {
      event: 'ProfileUpdated',
      timestamp: new Date(),
      data: result,
    });*/

    return result;
  }

  async deleteProfile(id: string) {
    const result = await firstValueFrom(
      this.profilesClient.send(PROFILE_PATTERNS.DELETE, id)
    );

    /*this.kafkaProducer.emit('profile-deleted', {
      event: 'ProfileDeleted',
      timestamp: new Date(),
      data: { id },
    });*/

    return result;
  }
}
