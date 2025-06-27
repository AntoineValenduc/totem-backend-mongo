import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BranchService } from '../services/branch.service';
import { BrancheCreateDto } from '../shared/dto/branche-create.dto';
import { BRANCH_PATTERNS } from '../shared/constants/patterns';
import { BranchDocument } from '../schema/branch.schema';
import { BrancheUpdateDto } from '../shared/dto/branche-update.dto';
import { BranchExposeDto } from '../shared/dto/branche-expose.dto';

@Controller()
export class BranchController {
  private readonly logger = new Logger(BranchController.name);

  constructor(private readonly branchService: BranchService) {}

  @MessagePattern(BRANCH_PATTERNS.FIND_ALL)
  async findAll(): Promise<BranchExposeDto[]> {
    return this.branchService.findAll();
  }

  @MessagePattern(BRANCH_PATTERNS.GET_BY_ID)
  async getById(@Payload('id') id: string): Promise<BranchExposeDto> {
    return this.branchService.getById(id);
  }

  @MessagePattern(BRANCH_PATTERNS.CREATE)
  async createBranch(
    @Payload() branchDto: BrancheCreateDto,
  ): Promise<BranchDocument> {
    return this.branchService.create(branchDto);
  }

  @MessagePattern(BRANCH_PATTERNS.UPDATE)
  async updateBranch(
    @Payload() data: { id: string; branch: BrancheUpdateDto },
  ): Promise<BranchDocument> {
    const { id, branch } = data;
    return this.branchService.update(id, branch);
  }

  @MessagePattern(BRANCH_PATTERNS.DELETE)
  async removeBranch(@Payload('id') id: string): Promise<BranchDocument> {
    return this.branchService.remove(id);
  }
}
