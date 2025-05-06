import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBranchDto } from '../../../totem-mongo/src/shared/dto/create-branch.dto';
import {BRANCH_PATTERNS} from "../../../totem-mongo/src/shared/constants/patterns";

@Injectable()
export class BranchesService {
  constructor(@Inject('TOTEM_MONGO_CLIENT') private profilesClient: ClientProxy) {}

  findAll() {
    return this.profilesClient.send(BRANCH_PATTERNS.FIND_ALL, {});
  }

  getById(id: string) {
    return this.profilesClient.send(BRANCH_PATTERNS.GET_BY_ID, { id });
  }

  createBranch(branchDto: CreateBranchDto) {
    return this.profilesClient.send(BRANCH_PATTERNS.CREATE, branchDto);
  }
}
