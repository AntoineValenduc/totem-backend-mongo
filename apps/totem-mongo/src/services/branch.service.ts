import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from '../schema/branch.schema';
import { CreateBranchDto } from '../shared/dto/create-branch.dto';

@Injectable()
export class BranchService {
  constructor(@InjectModel(Branch.name) private branchModel: Model<Branch>) {}

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().exec();
  }

  async getById(idBranch: string): Promise<Branch> {
    if (!idBranch) {
      throw new HttpException("ID can't be null", HttpStatus.BAD_REQUEST);
    }

    const branchFounded = await this.branchModel.findById(idBranch).exec();

    if (!branchFounded) {
      throw new HttpException('Branch not found', HttpStatus.NOT_FOUND);
    }

    return branchFounded;
  }

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const createdBranch = new this.branchModel(createBranchDto);
    return await createdBranch.save();
  }

  async update(createBranchDto: CreateBranchDto): Promise<Branch> {
    const createdBranch = new this.branchModel(createBranchDto);
    return await createdBranch.save();
  }
}
