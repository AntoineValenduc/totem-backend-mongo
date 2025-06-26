import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BadgesService } from './badges.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BadgeCreateDto } from '../../../totem-mongo/src/shared/dto/badge-create.dto';
import { BadgeUpdateDto } from '../../../totem-mongo/src/shared/dto/badge-update.dto';
import { BadgeExposeDto } from 'apps/totem-mongo/src/shared/dto/badge-expose.dto';

@ApiTags('badges')
@ApiBearerAuth()
@Controller('badges')
export class BadgesController {
  private readonly logger = new Logger(BadgesController.name);

  constructor(private readonly badgeService: BadgesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les badges' })
  @ApiResponse({
    status: 200,
    description: 'Liste des badges',
    type: [BadgeExposeDto],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  findAll() {
    return this.badgeService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtenir un badge par ID' })
  @ApiResponse({
    status: 200,
    description: 'Badge trouvé',
    type: BadgeExposeDto,
  })
  @ApiResponse({ status: 400, description: 'ID invalide' })
  @ApiResponse({ status: 404, description: 'Badge introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  getById(@Param('id') id: string) {
    return this.badgeService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un badge' })
  @ApiResponse({
    status: 201,
    description: 'Badge créé avec succès',
    type: BadgeCreateDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  createBadge(@Body() badge: BadgeCreateDto) {
    return this.badgeService.createBadge(badge);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un badge' })
  @ApiResponse({
    status: 200,
    description: 'Badge mis à jour avec succès',
    type: BadgeCreateDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Badge introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  updateBadge(@Param('id') id: string, @Body() badge: BadgeUpdateDto) {
    this.logger.log('✅ Requête envoyée => update badge, ID : ', { id });
    return this.badgeService.updateBadge(id, badge);
  }
}
