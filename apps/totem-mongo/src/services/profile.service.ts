import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, isValidObjectId, Model } from 'mongoose';
import { Profile, ProfileDocument } from '../schema/profile.schema';
import { ProfileCreateDto } from '../shared/dto/profile-create.dto';
import { ProfileUpdateDto } from '../shared/dto/profile-update.dto';
import {
  InvalidProfilIdException,
  NullProfileIdException,
  ProfileCreateException,
  ProfileInterneErrorException,
  ProfileNotFoundException,
} from '../shared/exceptions/profile.exception';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  /**
   * Afficher la liste des profiles
   */
  async findAll(): Promise<ProfileDocument[]> {
    this.logger.log('✅ Requête reçue => findAll profiles MongoDB');
    try {
      return await this.profileModel.find({ is_deleted: { $ne: true } }).exec();
    } catch (err) {
      this.logger.error('❌ Erreur lors du findAll() dans le service', err);
      throw new ProfileInterneErrorException("Liste des Profils : " + err.message + "");
    }
  }

  /**
   * Afficher la liste des profiles soft-deleted
   */
  async findAllSoftDeleted(): Promise<ProfileDocument[]> {
    this.logger.log('✅ SERVICE Requête reçue => findAllSoftDeleted profiles MongoDB');
    try {
      return this.profileModel.find({ is_deleted: { $ne: false } }).exec();
    } catch (err) {
      this.logger.error('❌ Erreur lors du findAllSoftDeleted() dans le service', err);
      throw new ProfileInterneErrorException("Liste des Profils Soft-Deleted: " + err.message + "");
    }
  }

  /**
   * Afficher un profile à partir de son ID
   * @param id
   */
  async getById(id: string): Promise<ProfileDocument> {
    this.logger.log("✅ Requête reçue => getById profiles MongoDB, avec l'ID: " + id);
    if (!id) {
      throw new NullProfileIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidProfilIdException(id);
    } else {
      return await this.findProfileById(id);
    }
  }

  /**
   * Créer un nouveau profile
   * @param dto
   */
  async create(dto: ProfileCreateDto): Promise<ProfileDocument> {
    this.logger.log("✅ Requête reçue => create profiles MongoDB");
    try {
      return await this.profileModel.create(dto);
    } catch (err) {
      this.logger.error('Erreur create()', err);
      throw new ProfileCreateException(err.message);
    }
  }

  /**
   * MAJ un profile existant à partir de son ID
   * @param id
   * @param profile
   */
  async update(id: string, profile: ProfileUpdateDto): Promise<ProfileDocument> {
    this.logger.log(`🔄 Mise à jour du profil ${id} avec : ${JSON.stringify(profile)}`);

    if (!id) {
      throw new NullProfileIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidProfilIdException(id);
    }

    await this.findProfileById(id);

    try {
      const updated = await this.profileModel.findByIdAndUpdate(
        id,
        { $set: profile },
        { new: true },
      ).exec();

      if (!updated) {
        throw new ProfileNotFoundException(id);
      }

      return updated;
    } catch (err) {
      this.logger.error('❌ Erreur lors du update() dans le service', err);
      throw new ProfileInterneErrorException('Update Profil ' + err.message, err);
    }
  }

  /**
   * Supprimer un profile existant à partir de son ID
   * @param id
   */
  async remove(id: string): Promise<ProfileDocument> {
    this.logger.log("✅ Requête reçue => remove profile MongoDB, avec l'ID: " + id);

    if (!id) {
      throw new NullProfileIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidProfilIdException(id);
    } else {
      const profile = await this.findProfileById(id);
      profile.is_deleted = true;
      profile.removed_at = new Date();
      return await profile.save();
    }
  }

  /**
   * Mérhode interne - Recherche Profile par ID
   * @param id
   * @private
   */
  private async findProfileById(
    id: string,
  ): Promise<HydratedDocument<Profile>> {
    if (!id) {
      throw new InvalidProfilIdException(id);
    }

    const profile = await this.profileModel.findById(id).exec();
    if (!profile || profile.is_deleted) {
      throw new ProfileNotFoundException(id);
    }

    return profile;
  }
}
