import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadgeUpdateDto } from 'totem-mongo/src/shared/dto/badge-update.dto';
import { BadgeCreateDto } from 'totem-mongo/src/shared/dto/badge-create.dto';

@ApiTags('badges')
@ApiBearerAuth()
@Controller('badges')
export class BadgesController {
  private readonly logger = new Logger(BadgesController.name);
  
  constructor(
    private readonly badgeService: BadgesService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les badges' })
  @ApiResponse({ status: 200, description: 'Liste des badges', type: [BadgeCreateDto] })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  findAll() {
    this.logger.log('✅ Requête envoyé => findAll badge');
    return this.badgeService.findAll();
  }

  @Get("/anciens")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les badges soft-deleted' })
  @ApiResponse({ status: 200, description: 'Liste des badges soft-deleted', type: [BadgeCreateDto] })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  findAllSoftDeleted() {
    this.logger.log('✅ Requête envoyé => findAllSoftDeleted badge');
    return this.badgeService.findAllSoftDeleted();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtenir un badge par ID' })
  @ApiResponse({ status: 200, description: 'Badge trouvé', type: BadgeCreateDto })
  @ApiResponse({ status: 400, description: 'ID invalide'})
  @ApiResponse({ status: 404, description: 'Badge introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  getById(@Param('id') id: string) {
    this.logger.log("✅ Requête envoyé => getById badge MongoDB, ID : ", { id });
    return this.badgeService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un badge' })
  @ApiResponse({ status: 201, description: 'Badge créé avec succès', type: BadgeCreateDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  createBadge(@Body() badge: BadgeCreateDto) {
    this.logger.log('✅ Requête envoyé => create badge');
    return this.badgeService.createBadge(badge);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un badge' })
  @ApiResponse({ status: 200, description: 'Badge mis à jour avec succès', type: BadgeCreateDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Badge introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  updateBadge(@Param('id') id: string, @Body() badge: BadgeUpdateDto) {
    this.logger.log("✅ Requête envoyée => update badge, ID : ", { id });
    return this.badgeService.updateBadge(id, badge);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Suppression douce d'un badge" })
  @ApiResponse({ status: 200, description: 'Badge supprimé avec succès' })
  @ApiResponse({ status: 400, description: 'ID invalide'})
  @ApiResponse({ status: 404, description: 'Badge introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  deleteBadge(@Param('id') id: string) {
    this.logger.log("✅ Requête envoyée => delete badge, ID : ", { id });
    return this.badgeService.deleteBadge(id);
  }
}
