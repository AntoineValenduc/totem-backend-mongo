import { Controller, Logger, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BranchService } from '../services/branch.service';
import { CreateBranchDto } from '../shared/dto/create-branch.dto';
import { BRANCH_PATTERNS } from '../shared/constants/patterns';
import { BranchDocument } from '../schema/branch.schema';
import { JwtAuthGuard } from '../../../../libs/auth/src/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class BranchController {
  private readonly logger = new Logger(BranchController.name);

  constructor(private readonly branchService: BranchService) {}

  @MessagePattern(BRANCH_PATTERNS.FIND_ALL)
  async findAll(): Promise<BranchDocument[]> {
    this.logger.log('✅ Requête reçue => findAll branchs MongoDB');
    return this.branchService.findAll();
  }

  @MessagePattern(BRANCH_PATTERNS.GET_BY_ID)
  async getById(@Payload('id') id: string): Promise<BranchDocument> {
    this.logger.log(`✅ Requête reçue => getById branch MongoDB (ID: ${id})`);
    return this.branchService.getById(id);
  }

  @MessagePattern(BRANCH_PATTERNS.CREATE)
  async createBranch(
    @Payload() branchDto: CreateBranchDto,
  ): Promise<BranchDocument> {
    this.logger.log('✅ Requête reçue => create branch MongoDB');
    return this.branchService.create(branchDto);
  }

  @MessagePattern(BRANCH_PATTERNS.UPDATE)
  async updateBranch(
    @Payload('id') id: string,
    @Payload() branchDto: CreateBranchDto,
  ): Promise<BranchDocument> {
    this.logger.log(`✅ Requête reçue => update branch MongoDB (ID: ${id})`);
    return this.branchService.update(id, branchDto);
  }

  @MessagePattern(BRANCH_PATTERNS.DELETE)
  async removeBranch(@Payload('id') id: string): Promise<BranchDocument> {
    this.logger.log(`✅ Requête reçue => remove branch MongoDB (ID: ${id})`);
    return this.branchService.remove(id);
  }
}
