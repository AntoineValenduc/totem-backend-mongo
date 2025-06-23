import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BRANCH_PATTERNS } from '../../../totem-mongo/src/shared/constants/patterns';
import { BrancheCreateDto } from '../../../totem-mongo/src/shared/dto/branche-create.dto';
import { BrancheUpdateDto } from '../../../totem-mongo/src/shared/dto/branche-update.dto';

@Injectable()
export class BranchesService {
  private readonly logger = new Logger(BranchesService.name);

  constructor(
    @Inject('TOTEM_MONGO_CLIENT') private readonly branchesClient: ClientProxy,
  ) {}

  findAll() {
    return this.branchesClient.send(BRANCH_PATTERNS.FIND_ALL, {});
  }

  getById(id: string) {
    return this.branchesClient.send(BRANCH_PATTERNS.GET_BY_ID, { id });
  }

  async createBranche(branchDto: BrancheCreateDto): Promise<BrancheCreateDto> {
    return await firstValueFrom<BrancheCreateDto>(
      this.branchesClient.send(BRANCH_PATTERNS.CREATE, branchDto),
    );
  }

  async updateBranche(
    id: string,
    branch: BrancheUpdateDto,
  ): Promise<BrancheUpdateDto> {
    this.logger.log(`✅ service API (ID: ${id})`);
    this.logger.log(`✅ service API (Payload: ${JSON.stringify(branch)})`);
    return await firstValueFrom<BrancheUpdateDto>(
      this.branchesClient.send(BRANCH_PATTERNS.UPDATE, { id, branch: branch }),
    );
  }

  async deleteBranche(id: string): Promise<{ deleted: boolean }> {
    return await firstValueFrom<{ deleted: boolean }>(
      this.branchesClient.send(BRANCH_PATTERNS.DELETE, { id }),
    );
  }
}
