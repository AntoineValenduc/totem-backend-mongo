import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ProfileCreateDto } from '../../../totem-mongo/src/shared/dto/profile-create.dto';
import { ProfileUpdateDto } from '../../../totem-mongo/src/shared/dto/profile-update.dto';
import { ProfileBadgeDto } from 'apps/totem-mongo/src/shared/dto/profileBadge.dto';
import { ProfileExposeDto } from 'apps/totem-mongo/src/shared/dto/profile-expose.dto';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  private readonly logger = new Logger(ProfilesController.name);

  constructor(private readonly profileService: ProfilesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les profils' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils',
    type: [ProfileExposeDto],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  findAll() {
    return this.profileService.findAll();
  }

  @Get('/anciens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les profils soft-deleted' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils soft-deleted',
    type: [ProfileExposeDto],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  findAllSoftDeleted() {
    return this.profileService.findAllSoftDeleted();
  }

  @Get('branch/:branchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les profils d’une branche' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils liés à la branche',
    type: [ProfileExposeDto],
  })
  @ApiResponse({ status: 400, description: 'ID de branche invalide' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  getProfilesByBranch(@Param('branchId', ParseObjectIdPipe) branchId: string) {
    return this.profileService.findAllByBranch(branchId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtenir un profil par ID' })
  @ApiResponse({
    status: 200,
    description: 'Profil trouvé',
    type: ProfileExposeDto,
  })
  @ApiResponse({ status: 400, description: 'ID invalide' })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  getById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.profileService.getById(id);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtenir un profil par user_id SQL' })
  @ApiResponse({
    status: 200,
    description: 'Profil trouvé',
    type: ProfileExposeDto,
  })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  getByUserId(@Param('userId') userId: string) {
    return this.profileService.getByUserId(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un profil' })
  @ApiResponse({
    status: 201,
    description: 'Profil créé avec succès',
    type: ProfileCreateDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  createProfile(@Body() profile: ProfileCreateDto) {
    return this.profileService.createProfile(profile);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un profil' })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
    type: ProfileCreateDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  updateProfile(@Param('id') id: string, @Body() profile: ProfileUpdateDto) {
    return this.profileService.updateProfile(id, profile);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Suppression douce d'un profil" })
  @ApiResponse({ status: 200, description: 'Profil supprimé avec succès' })
  @ApiResponse({ status: 400, description: 'ID invalide' })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  deleteProfile(@Param('id') id: string) {
    return this.profileService.deleteProfile(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un profil' })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
    type: ProfileCreateDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  updateBadgeProfile(
    @Param('id') profileId: string,
    @Body() profileBadge: ProfileBadgeDto,
  ) {
    return this.profileService.addBadgeToProfile(profileId, profileBadge);
  }
}
