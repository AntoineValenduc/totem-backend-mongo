import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Badge, BadgeDocument } from '../schema/badge.schema';
import { CreateBadgeDto } from '../shared/dto/create-badge.dto';

@Injectable()
export class BadgeService {
  constructor(
    @InjectModel(Badge.name) private readonly badgeModel: Model<Badge>,
  ) {}

  async findAll(): Promise<BadgeDocument[]> {
    return this.badgeModel.find({ is_deleted: { $ne: true } }).exec();
  }

  async getById(idBadge: string): Promise<BadgeDocument> {
    return this.findBadgeById(idBadge);
  }

  async create(createBadgeDto: CreateBadgeDto): Promise<BadgeDocument> {
    const createdBadge = new this.badgeModel(createBadgeDto);
    return await createdBadge.save();
  }

  async update(
    idBadge: string,
    updateBadgeDto: CreateBadgeDto,
  ): Promise<BadgeDocument> {
    const badge = await this.findBadgeById(idBadge);
    Object.assign(badge, updateBadgeDto);
    return await badge.save();
  }

  async remove(idBadge: string): Promise<BadgeDocument> {
    const badge = await this.findBadgeById(idBadge);

    // Soft delete using a single query
    badge.is_deleted = true;
    badge.removed_at = new Date();
    await badge.save();

    return badge;
  }

  private async findBadgeById(
    idBadge: string,
  ): Promise<HydratedDocument<Badge>> {
    if (!idBadge) {
      throw new HttpException("ID can't be null", HttpStatus.BAD_REQUEST);
    }

    const badge = await this.badgeModel.findById(idBadge).exec();
    if (!badge || badge.is_deleted) {
      throw new HttpException('Badge not found', HttpStatus.NOT_FOUND);
    }

    return badge;
  }
}
