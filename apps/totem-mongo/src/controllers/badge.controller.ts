import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BadgeService } from '../services/badge.service';
import { BADGE_PATTERNS } from '../shared/constants/patterns';
import { BadgeDocument } from '../schema/badge.schema';
import { BadgeCreateDto } from '../shared/dto/badge-create.dto';
import { BadgeUpdateDto } from '../shared/dto/badge-update.dto';
import { BadgeExposeDto } from '../shared/dto/badge-expose.dto';
import {
  BadgeInterneErrorException,
  InvalidBadgeIdException,
} from '../shared/exceptions/badge.exception';

@Controller()
export class BadgeController {
  private readonly logger: Logger = new Logger(BadgeController.name);

  constructor(private readonly badgeService: BadgeService) {}

  @MessagePattern(BADGE_PATTERNS.FIND_ALL)
  async findAll(): Promise<BadgeExposeDto[]> {
    return this.badgeService.findAll();
  }

  @MessagePattern(BADGE_PATTERNS.GET_BY_ID)
  async getById(@Payload('id') id: string): Promise<BadgeExposeDto> {
    if (!id) {
      throw new InvalidBadgeIdException('Requête reçue => ID is required');
    } else {
      try {
        return await this.badgeService.getById(id);
      } catch (err) {
        console.error('Erreur dans getById:', err);
        throw new BadgeInterneErrorException('Erreur interne microservice');
      }
    }
  }

  @MessagePattern(BADGE_PATTERNS.CREATE)
  async createBadge(
    @Payload() badgeDto: BadgeCreateDto,
  ): Promise<BadgeDocument> {
    return this.badgeService.create(badgeDto);
  }

  @MessagePattern(BADGE_PATTERNS.UPDATE)
  async updateBadge(
    @Payload() data: { id: string; badge: BadgeUpdateDto },
  ): Promise<BadgeDocument> {
    const { id, badge } = data;
    return this.badgeService.update(id, badge);
  }
}
