import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Branch, BranchDocument } from '../schema/branch.schema';
import { CreateBranchDto } from '../shared/dto/create-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
  ) {}

  async findAll(): Promise<BranchDocument[]> {
    return this.branchModel.find({ is_deleted: { $ne: true } }).exec();
  }

  async getById(idBranch: string): Promise<BranchDocument> {
    return this.findBranchById(idBranch);
  }

  async create(createBranchDto: CreateBranchDto): Promise<BranchDocument> {
    const createdBranch = new this.branchModel(createBranchDto);
    return await createdBranch.save();
  }

  async update(
    idBranch: string,
    updateBranchDto: CreateBranchDto,
  ): Promise<BranchDocument> {
    const branch = await this.findBranchById(idBranch);
    Object.assign(branch, updateBranchDto);
    return await branch.save();
  }

  async remove(idBranch: string): Promise<BranchDocument> {
    const branch = await this.findBranchById(idBranch);

    // Soft delete using a single query
    branch.is_deleted = true;
    branch.removed_at = new Date();
    await branch.save();

    return branch;
  }

  private async findBranchById(
    idBranch: string,
  ): Promise<HydratedDocument<Branch>> {
    if (!idBranch) {
      throw new HttpException("ID can't be null", HttpStatus.BAD_REQUEST);
    }

    const branch = await this.branchModel.findById(idBranch).exec();
    if (!branch || branch.is_deleted) {
      throw new HttpException('Branch not found', HttpStatus.NOT_FOUND);
    }

    return branch;
  }
}
