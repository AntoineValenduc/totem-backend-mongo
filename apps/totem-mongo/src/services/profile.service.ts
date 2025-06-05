import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Profile, ProfileDocument } from '../schema/profile.schema';
import { CreateProfileDto } from '../shared/dto/create-profile.dto';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TOPICS } from '../shared/constants/kafka-topics';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    //@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * Afficher la liste des profiles
   */
  async findAll(): Promise<ProfileDocument[]> {
    return this.profileModel.find({ is_deleted: { $ne: true } }).exec();
  }

  /**
   * Afficher un profile à partir de son ID
   * @param idProfile
   */
  async getById(idProfile: string): Promise<ProfileDocument> {
    return this.findProfileById(idProfile);
  }

  /**
   * Créer un nouveau profile
   * @param createProfileDto
   */
  async create(createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    const createdProfile = new this.profileModel(createProfileDto);
    const saved = await createdProfile.save();

    /**this.logger.log(`📤 Emitting Kafka event: profile-created for ID ${saved._id}`);
    this.kafkaClient.emit(KAFKA_TOPICS.PROFILE_CREATED, {
      id: saved._id,
      ...createProfileDto,
    });*/

    return saved;
  }

  /**
   * MAJ un profile existant à partir de son ID
   * @param idProfile
   * @param updateProfileDto
   */
  async update(idProfile: string, updateProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    const profile = await this.findProfileById(idProfile);
    Object.assign(profile, updateProfileDto);
    const updated = await profile.save();

    /**this.logger.log(`📤 Emitting Kafka event: profile-updated for ID ${updated._id}`);
    this.kafkaClient.emit(KAFKA_TOPICS.PROFILE_UPDATED, {
      id: updated._id,
      ...updateProfileDto,
    });*/

    return updated;
  }

  /**
   * Supprimer un profile existant à partir de son ID
   * @param idProfile
   */
  async remove(idProfile: string): Promise<ProfileDocument> {
    const profile = await this.findProfileById(idProfile);
    profile.is_deleted = true;
    profile.removed_at = new Date();
    const deleted = await profile.save();

   /** this.logger.log(`📤 Emitting Kafka event: profile-deleted for ID ${deleted._id}`);
    this.kafkaClient.emit(KAFKA_TOPICS.PROFILE_DELETED, {
      id: deleted._id,
      removed_at: deleted.removed_at,
    });*/

    return deleted;
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
