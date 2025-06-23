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
import { BranchesService } from './branches.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BrancheCreateDto } from '../../../totem-mongo/src/shared/dto/branche-create.dto';
import { BrancheUpdateDto } from '../../../totem-mongo/src/shared/dto/branche-update.dto';

@ApiTags('branches')
@ApiBearerAuth()
@Controller('branches')
export class BranchesController {
  private readonly logger = new Logger(BranchesController.name);

  constructor(private readonly brancheService: BranchesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les branches' })
  @ApiResponse({
    status: 200,
    description: 'Liste des branches',
    type: [BrancheCreateDto],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  findAll() {
    this.logger.log('✅ Requête envoyé => findAll branche');
    return this.brancheService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtenir un branche par ID' })
  @ApiResponse({
    status: 200,
    description: 'Branche trouvé',
    type: BrancheCreateDto,
  })
  @ApiResponse({ status: 400, description: 'ID invalide' })
  @ApiResponse({ status: 404, description: 'Branche introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  getById(@Param('id') id: string) {
    this.logger.log('✅ Requête envoyé => getById branche MongoDB, ID : ', {
      id,
    });
    return this.brancheService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un branche' })
  @ApiResponse({
    status: 201,
    description: 'Branche créé avec succès',
    type: BrancheCreateDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  createBranch(@Body() branchDto: BrancheCreateDto) {
    this.logger.log('✅ Requête envoyé => create branche');
    return this.brancheService.createBranche(branchDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un branche' })
  @ApiResponse({
    status: 200,
    description: 'Branche mis à jour avec succès',
    type: BrancheCreateDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Branche introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  updateBranch(@Param('id') id: string, @Body() branch: BrancheUpdateDto) {
    this.logger.log('✅ Requête envoyée => update branche, ID : ', {
      id,
      branch,
    });
    return this.brancheService.updateBranche(id, branch);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Suppression douce d'un branche" })
  @ApiResponse({ status: 200, description: 'Branche supprimé avec succès' })
  @ApiResponse({ status: 400, description: 'ID invalide' })
  @ApiResponse({ status: 404, description: 'Branche introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  deleteBranch(@Param('id') id: string) {
    this.logger.log('✅ Requête envoyée => delete branchee, ID : ', { id });
    return this.brancheService.deleteBranche(id);
  }
}
