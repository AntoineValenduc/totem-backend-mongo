import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from 'totem-mongo/src/shared/dto/create-profile.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get('list')
  @ApiOperation({ summary: 'Lister tous les profils' })
  @ApiResponse({ status: 200, description: 'Liste des profils' })
  findAll() {
    console.log('✅ Requête envoyé => findAll profile MongoDB');
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un profil par ID' })
  @ApiResponse({ status: 200, description: 'Profil trouvé' })
  getById(@Param('id') id: string) {
    console.log('✅ Requête envoyé => getById profile MongoDB');
    return this.profileService.getById(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Créer un profil' })
  @ApiResponse({ status: 201, description: 'Profil créé avec succès' })
  createProfile(@Body() profile: CreateProfileDto) {
    console.log('✅ Requête envoyé => create profile MongoDB');
    return this.profileService.createProfile(profile);
  }

  @Put('update/:id') // Modification : ajout de `:id` pour inclure l'ID dans l'URL
  @ApiOperation({ summary: 'Modifier un profil' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès' })
  updateProfile(@Param('id') id: string, @Body() profile: CreateProfileDto) {
    console.log('✅ Requête envoyé => update profile MongoDB');
    return this.profileService.updateProfile(id, profile);
  }

  @Delete('delete/:id') // Modification : ajout de `:id` pour inclure l'ID dans l'URL
  @ApiOperation({ summary: "Suppression douce d'un profil" })
  @ApiResponse({ status: 200, description: 'Profil supprimé avec succès' })
  deleteProfile(@Param('id') id: string) {
    console.log('✅ Requête envoyé => delete profile MongoDB');
    return this.profileService.deleteProfile(id);
  }
}
