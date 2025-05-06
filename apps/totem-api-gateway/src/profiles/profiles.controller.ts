import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from '../../../totem-mongo/src/shared/dto/create-profile.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get('list')
  @ApiOperation({ summary: 'Lister tous les profils' })
  @ApiResponse({ status: 200, description: 'Liste des profils' })
  findAll() {
    console.log('✅ Requête envoyé => findAll profile MongoDB');
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un profil par ID' })
  getById(@Param('id') id: string) {
    console.log('✅ Requête envoyé => getById profile MongoDB');
    return this.profileService.getById(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Créer un profil' })
  createProfile(@Body() profile: CreateProfileDto) {
    console.log('✅ Requête envoyé => create profile MongoDB');
    return this.profileService.createProfile(profile);
  }
}
