import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from '../../../totem-mongo/src/shared/dto/create-branch.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../libs/auth/src/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('branches')
@Controller('branches')
export class BranchesController {
  constructor(private branchService: BranchesService) {}

  @Get('list')
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.branchService.getById(id);
  }

  @Post('create')
  createBranch(@Body() branchDto: CreateBranchDto) {
    return this.branchService.createBranch(branchDto);
  }
}
