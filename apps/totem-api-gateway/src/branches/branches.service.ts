import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BrancheCreateDto } from '@totem-mongo/src/shared/dto/branche-create.dto';
import { BRANCH_PATTERNS } from '@totem-mongo/src/shared/constants/patterns';
import { firstValueFrom } from 'rxjs';
import { BrancheUpdateDto } from '@totem-mongo/src/shared/dto/branche-update.dto';

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

  async createBranche(branchDto: BrancheCreateDto) {
    return await firstValueFrom(
      this.branchesClient.send(BRANCH_PATTERNS.CREATE, branchDto),
    );
  }

  async updateBranche(id: string, branch: BrancheUpdateDto) {
    this.logger.log(`✅ service API (ID: ${id})`);
    this.logger.log(`✅ service API (Payload: ${JSON.stringify(branch)})`);
    return await firstValueFrom(
      this.branchesClient.send(BRANCH_PATTERNS.UPDATE, { id, branch: branch }),
    );
  }

  async deleteBranche(id: string) {
    return await firstValueFrom(
      this.branchesClient.send(BRANCH_PATTERNS.DELETE, { id }),
    );
  }
}
