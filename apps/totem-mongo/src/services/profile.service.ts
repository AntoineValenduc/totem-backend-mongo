import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Profile, ProfileDocument } from '../schema/profile.schema';
import { CreateProfileDto } from '../shared/dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  async findAll(): Promise<ProfileDocument[]> {
    return this.profileModel.find({ is_deleted: { $ne: true } }).exec();
  }

  async getById(idProfile: string): Promise<ProfileDocument> {
    return this.findProfileById(idProfile);
  }

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    const createdProfile = new this.profileModel(createProfileDto);
    return await createdProfile.save();
  }

  async update(
    idProfile: string,
    updateProfileDto: CreateProfileDto,
  ): Promise<ProfileDocument> {
    const profile = await this.findProfileById(idProfile);
    Object.assign(profile, updateProfileDto);
    return await profile.save();
  }

  async remove(idProfile: string): Promise<ProfileDocument> {
    const profile = await this.findProfileById(idProfile);

    // Soft delete using a single query
    profile.is_deleted = true;
    profile.removed_at = new Date();
    await profile.save();

    return profile;
  }

  private async findProfileById(
    idProfile: string,
  ): Promise<HydratedDocument<Profile>> {
    if (!idProfile) {
      throw new HttpException("ID can't be null", HttpStatus.BAD_REQUEST);
    }

    const profile = await this.profileModel.findById(idProfile).exec();
    if (!profile || profile.is_deleted) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return profile;
  }
}
