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
    type: [ProfileCreateDto],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  findAll() {
    this.logger.log('✅ Requête envoyé => findAll profile');
    return this.profileService.findAll();
  }

  @Get('/anciens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les profils soft-deleted' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils soft-deleted',
    type: [ProfileCreateDto],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  findAllSoftDeleted() {
    this.logger.log('✅ Requête envoyé => findAllSoftDeleted profile');
    return this.profileService.findAllSoftDeleted();
  }

  @Get('branch/:branchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les profils d’une branche' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils liés à la branche',
    type: [ProfileCreateDto],
  })
  @ApiResponse({ status: 400, description: 'ID de branche invalide' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  getProfilesByBranch(@Param('branchId', ParseObjectIdPipe) branchId: string) {
    this.logger.log(
      `✅ Requête envoyée => getProfilesByBranch, ID : ${branchId}`,
    );
    return this.profileService.findAllByBranch(branchId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtenir un profil par ID' })
  @ApiResponse({
    status: 200,
    description: 'Profil trouvé',
    type: ProfileCreateDto,
  })
  @ApiResponse({ status: 400, description: 'ID invalide' })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  getById(@Param('id', ParseObjectIdPipe) id: string) {
    this.logger.log('✅ Requête envoyé => getById profile MongoDB, ID : ', {
      id,
    });
    return this.profileService.getById(id);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtenir un profil par user_id SQL' })
  @ApiResponse({
    status: 200,
    description: 'Profil trouvé',
    type: ProfileCreateDto,
  })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  getByUserId(@Param('userId') userId: string) {
    this.logger.log(
      '✅ Requête envoyé => getByUserId profile, user_id :',
      userId,
    );
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
    this.logger.log('✅ Requête envoyé => create profile');
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
    this.logger.log('✅ Requête envoyée => update profile, ID : ', { id });
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
    this.logger.log('✅ Requête envoyée => delete profile, ID : ', { id });
    return this.profileService.deleteProfile(id);
  }
}
