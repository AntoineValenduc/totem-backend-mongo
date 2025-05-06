import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Badge } from '../schema/badge.schema';
import { CreateBadgeDto } from '../shared/dto/create-badge.dto';

@Injectable()
export class BadgeService {
  constructor(@InjectModel(Badge.name) private badgeModel: Model<Badge>) {}

  async findAll(): Promise<Badge[]> {
    return this.badgeModel.find().exec();
  }

  async getById(idBadge: string): Promise<Badge> {
    if (!idBadge) {
      throw new HttpException("ID can't be null", HttpStatus.BAD_REQUEST);
    }

    const badgeFounded = await this.badgeModel.findById(idBadge).exec();

    if (!badgeFounded) {
      throw new HttpException('Badge not found', HttpStatus.NOT_FOUND);
    }

    return badgeFounded;
  }

  async create(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const createdBadge = new this.badgeModel(createBadgeDto);
    return await createdBadge.save();
  }

  async update(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const createdBadge = new this.badgeModel(createBadgeDto);
    return await createdBadge.save();
  }
}
