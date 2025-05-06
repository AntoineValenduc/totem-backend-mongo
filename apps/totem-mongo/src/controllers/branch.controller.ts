import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BranchService } from '../services/branch.service';
import { CreateBranchDto } from '../shared/dto/create-branch.dto';
import {BRANCH_PATTERNS} from "../shared/constants/patterns";

@Controller()
export class BranchController {
  constructor(private readonly brancheService: BranchService) {}

  @MessagePattern(BRANCH_PATTERNS.FIND_ALL)
  async findAll() {
    console.log('Requête reçue => findAll branch MongoDB');
    return this.brancheService.findAll();
  }

  @MessagePattern(BRANCH_PATTERNS.GET_BY_ID)
  async getById(@Payload('id') id: string) {
    console.log('Requête reçue => getById branch MongoDB');
    return this.brancheService.getById(id);
  }

  @MessagePattern(BRANCH_PATTERNS.CREATE)
  async createBranch(brancheDto: CreateBranchDto) {
    console.log('Requête reçue => create branch MongoDB');
    return this.brancheService.create(brancheDto);
  }
}
