import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BadgeService } from '../services/badge.service';
import { CreateBadgeDto } from '../shared/dto/create-badge.dto';
import {BADGE_PATTERNS} from "../shared/constants/patterns";

@Controller()
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @MessagePattern(BADGE_PATTERNS.FIND_ALL)
  async findAll() {
    console.log('✅ Requête reçue => findAll branch MongoDB');
    return this.badgeService.findAll();
  }

  @MessagePattern(BADGE_PATTERNS.GET_BY_ID)
  async getById(@Payload('id') id: string) {
    console.log('✅ Requête reçue => getById branch MongoDB');
    return this.badgeService.getById(id);
  }

  @MessagePattern(BADGE_PATTERNS.CREATE)
  async createBadge(badgeDto: CreateBadgeDto) {
    console.log('✅ Requête reçue => create branch MongoDB');
    return this.badgeService.create(badgeDto);
  }
}
