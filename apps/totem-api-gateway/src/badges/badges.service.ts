import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BADGE_PATTERNS } from '../../../totem-mongo/src/shared/constants/patterns';
import { BadgeCreateDto } from '../../../totem-mongo/src/shared/dto/badge-create.dto';
import { BadgeUpdateDto } from '../../../totem-mongo/src/shared/dto/badge-update.dto';
@Injectable()
export class BadgesService {
  constructor(
    @Inject('TOTEM_MONGO_CLIENT') private readonly badgeClient: ClientProxy,
  ) {}

  findAll() {
    return this.badgeClient.send(BADGE_PATTERNS.FIND_ALL, {});
  }

  findAllSoftDeleted() {
    return this.badgeClient.send(BADGE_PATTERNS.FIND_ALL_SOFT_DELETED, {});
  }

  getById(id: string) {
    return this.badgeClient.send(BADGE_PATTERNS.GET_BY_ID, { id });
  }

  async createBadge(badge: BadgeCreateDto) {
    return await firstValueFrom(
      this.badgeClient.send(BADGE_PATTERNS.CREATE, badge),
    );
  }

  async updateBadge(id: string, badge: BadgeUpdateDto) {
    return await firstValueFrom(
      this.badgeClient.send(BADGE_PATTERNS.UPDATE, { id, badge: badge }),
    );
  }

  async deleteBadge(id: string) {
    return await firstValueFrom(
      this.badgeClient.send(BADGE_PATTERNS.DELETE, { id }),
    );
  }
}
