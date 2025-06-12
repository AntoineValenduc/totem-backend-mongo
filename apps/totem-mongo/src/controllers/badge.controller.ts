import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { BadgeService } from '../services/badge.service';
import { BADGE_PATTERNS } from '../shared/constants/patterns';
import { BadgeDocument } from '../schema/badge.schema';
import { BadgeCreateDto } from '../shared/dto/badge-create.dto';
import { BadgeUpdateDto } from '../shared/dto/badge-update.dto';

@Controller()
export class BadgeController {
  private readonly logger: Logger = new Logger(BadgeController.name);

  constructor(private readonly badgeService: BadgeService) {}

  @MessagePattern(BADGE_PATTERNS.FIND_ALL)
  async findAll(): Promise<BadgeDocument[]> {
    this.logger.log('✅ Requête reçue => findAll badges MongoDB');
    return this.badgeService.findAll();
  }

  @MessagePattern(BADGE_PATTERNS.FIND_ALL_SOFT_DELETED)
  async findAllSoftDeleted(): Promise<BadgeDocument[]> {
    this.logger.log('✅ Requête reçue => findAll badges soft-deleted MongoDB');
    return this.badgeService.findAllSoftDeleted();
  }

  @MessagePattern(BADGE_PATTERNS.GET_BY_ID)
  async getById(@Payload('id') id: string): Promise<BadgeDocument> {
    this.logger.log(`✅ Requête reçue => getById badge MongoDB (ID: ${id})`);
    if (!id) {
      this.logger.error('❌ Requête reçue => ID is required');
      throw new Error('❌ Requête reçue => ID is required');
    } else {
      try {
        return await this.badgeService.getById(id);
      } catch (error) {
        console.error('❌ Erreur dans getById:', error);
        throw new RpcException(error.message || 'Erreur interne microservice');
      }
    }
  }

  @MessagePattern(BADGE_PATTERNS.CREATE)
  async createBadge(
    @Payload() badgeDto: BadgeCreateDto,
  ): Promise<BadgeDocument> {
    this.logger.log('✅ Requête reçue => create badge MongoDB');
    return this.badgeService.create(badgeDto);
  }

  @MessagePattern(BADGE_PATTERNS.UPDATE)
  async updateBadge(@Payload() data: { id: string; badge: BadgeUpdateDto }): Promise<BadgeDocument> {
    const { id, badge } = data;
    this.logger.log(`✅ Requête reçue => update badge MongoDB (ID: ${id})`);
    this.logger.log(`✅ Requête reçue => update badge MongoDB (Payload: ${JSON.stringify(badge)})`);
    return this.badgeService.update(id, badge);
  }

  @MessagePattern(BADGE_PATTERNS.DELETE)
  async removeBadge(@Payload('id') id: string): Promise<BadgeDocument> {
    if (!id) {
      this.logger.error('❌ Requête reçue => ID is required');
      throw new Error('❌ Requête reçue => ID is required');
    } else {
      this.logger.log(
        `✅ Requête reçue => getById badge MongoDB (ID: ${id})`,
      );
      try {
        return await this.badgeService.remove(id);
      } catch (error) {
        console.error('❌ Erreur dans getById:', error);
        throw new RpcException(error.message || 'Erreur interne microservice');
      }
    }
  }
}
