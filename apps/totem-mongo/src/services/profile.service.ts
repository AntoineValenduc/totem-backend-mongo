import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '../schema/profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDto } from '../shared/dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async getById(id: string) {
    console.log('Recherche du profil avec ID :', id);

    try {
      const profile = await this.profileModel.findById(id).exec();
      if (!profile) {
        throw new NotFoundException(`id_profile ${id} not found`);
      }
      return profile;
    } catch (error) {
      console.error('Erreur dans getById:', error.message);
      throw new InternalServerErrorException('Erreur lors de la récupération du profil');
    }
  }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const createdProfile = new this.profileModel(createProfileDto);
    return await createdProfile.save();
  }

  async update(createProfileDto: CreateProfileDto): Promise<Profile> {
    const createdProfile = new this.profileModel(createProfileDto);
    return await createdProfile.save();
  }
}
