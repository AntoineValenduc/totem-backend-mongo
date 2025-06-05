import { Inject, Injectable } from '@nestjs/common';
import { CreateBadgeDto } from 'totem-mongo/src/shared/dto/create-badge.dto';
import { BADGE_PATTERNS } from 'totem-mongo/src/shared/constants/patterns';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class BadgesService {
  constructor(
    @Inject('TOTEM_MONGO_CLIENT') private readonly profilesClient: ClientProxy,
  ) {}

  findAll() {
    return this.profilesClient.send(BADGE_PATTERNS.FIND_ALL, {});
  }

  getById(id: string) {
    return this.profilesClient.send(BADGE_PATTERNS.GET_BY_ID, { id });
  }

  createBranch(badgeDto: CreateBadgeDto) {
    return this.profilesClient.send(BADGE_PATTERNS.CREATE, badgeDto);
  }
}
