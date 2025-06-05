import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from 'totem-mongo/src/shared/dto/create-badge.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../libs/auth/src/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('badges')
@Controller('badges')
export class BadgesController {
  constructor(private badgeService: BadgesService) {}

  @Get('list')
  findAll() {
    return this.badgeService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.badgeService.getById(id);
  }

  @Post('create')
  createBranch(@Body() branchDto: CreateBadgeDto) {
    return this.badgeService.createBranch(branchDto);
  }
}
