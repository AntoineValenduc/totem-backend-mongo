import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BadgeService } from '../services/badge.service';
import { CreateBadgeDto } from '../shared/dto/create-badge.dto';
import { BADGE_PATTERNS } from '../shared/constants/patterns';
import { BadgeDocument } from '../schema/badge.schema';
import { Authenticated } from '../../../../libs/auth/src/decorators/authenticated.decorator';


@Controller()
export class BadgeController {
  private readonly logger: Logger = new Logger(BadgeController.name);

  constructor(private readonly badgeService: BadgeService) {}

  @MessagePattern(BADGE_PATTERNS.FIND_ALL)
  async findAll(
    @Authenticated() user: any
  ): Promise<BadgeDocument[]> {
    this.logger.log('✅ Requête reçue => findAll badges MongoDB');
    return this.badgeService.findAll();
  }

  @MessagePattern(BADGE_PATTERNS.GET_BY_ID)
  async getById(
    @Authenticated() user: any,
    @Payload('id') id: string
  ): Promise<BadgeDocument> {
    this.logger.log(`✅ Requête reçue => getById badge MongoDB (ID: ${id})`);
    return this.badgeService.getById(id);
  }

  @MessagePattern(BADGE_PATTERNS.CREATE)
  async createBadge(
    @Authenticated() user: any,
    @Payload() badgeDto: CreateBadgeDto
  ): Promise<BadgeDocument> {
    this.logger.log('✅ Requête reçue => create badge MongoDB');
    return this.badgeService.create(badgeDto);
  }

  @MessagePattern(BADGE_PATTERNS.UPDATE)
  async updateBadge(
    @Authenticated() user: any,
    @Payload('id') id: string,
    @Payload() badgeDto: CreateBadgeDto
  ): Promise<BadgeDocument> {
    this.logger.log(`✅ Requête reçue => update badge MongoDB (ID: ${id})`);
    return this.badgeService.update(id, badgeDto);
  }

  @MessagePattern(BADGE_PATTERNS.DELETE)
  async removeBadge(
    @Authenticated() user: any,
    @Payload('id') id: string, payload: any
  ): Promise<BadgeDocument> {
    this.logger.log(`✅ Requête reçue => remove badge MongoDB (ID: ${id})`);
    return this.badgeService.remove(id);
  }
}
