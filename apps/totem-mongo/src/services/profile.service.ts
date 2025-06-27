import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, isValidObjectId, Model, Types } from 'mongoose';
import { Profile, ProfileDocument } from '../schema/profile.schema';
import { ProfileCreateDto } from '../shared/dto/profile-create.dto';
import { ProfileUpdateDto } from '../shared/dto/profile-update.dto';
import { ProfileBadgeDto } from '../shared/dto/profileBadge.dto';
import {
  InvalidProfilIdException,
  NullProfileIdException,
  ProfileCreateException,
  ProfileInterneErrorException,
  ProfileNotFoundException,
} from '../shared/exceptions/profile.exception';
import { ProfileExposeDto } from '../shared/dto/profile-expose.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  /**
   * Afficher la liste des profiles
   */
  async findAll(): Promise<ProfileExposeDto[]> {
    try {
      const profiles = await this.profileModel
        .find({ is_deleted: false })
        .populate({ path: 'branch', populate: { path: 'badges' } })
        .lean()
        .exec();

      return plainToInstance(ProfileExposeDto, profiles, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      this.logger.error('Erreur lors du findAll() dans le service', err);
      throw new ProfileInterneErrorException(
        'Erreur lors de la récupération des profils',
      );
    }
  }

  /**
   * Afficher la liste des profiles soft-deleted
   */
  async findAllSoftDeleted(): Promise<ProfileExposeDto[]> {
    this.logger.log(
      '✅ SERVICE Requête reçue => findAllSoftDeleted profiles MongoDB',
    );
    try {
      const profiles = await this.profileModel
        .find({ is_deleted: true })
        .populate({ path: 'branch', populate: { path: 'badges' } })
        .lean()
        .exec();

      return plainToInstance(ProfileExposeDto, profiles, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      this.logger.error(
        'Erreur lors du findAllSoftDeleted() dans le service',
        err,
      );
      throw new ProfileInterneErrorException(
        'Erreur lors de la récupération des profils supprimés',
      );
    }
  }

  /**
   * Afficher tous les profiles d'une branche
   * @param branchId
   */
  async getProfilesByBranch(branchId: string): Promise<ProfileExposeDto[]> {
    if (!isValidObjectId(branchId)) {
      throw new InvalidProfilIdException(branchId);
    }
    try {
      const profiles = await this.profileModel
        .find({ branch: new Types.ObjectId(branchId), is_deleted: false })
        .populate({ path: 'branch', populate: { path: 'badge' } })
        .lean()
        .exec();

      return plainToInstance(ProfileExposeDto, profiles, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      this.logger.error('Erreur getProfilesByBranch()', err);
      throw new ProfileInterneErrorException(
        'Erreur lors de la récupération des profils pour la branche',
      );
    }
  }

  /**
   * Afficher un profile à partir de son ID
   * @param id
   */
  async getById(id: string): Promise<ProfileExposeDto> {
    if (!id) {
      throw new NullProfileIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidProfilIdException(id);
    } else {
      const profile = await this.findProfileById(id);

      return plainToInstance(ProfileExposeDto, profile, {
        excludeExtraneousValues: true,
      });
    }
  }

  /**
   * Afficher un profile à partir de son user.id PostgreSQL
   * @param userId
   */
  async getByUserId(userId: string): Promise<ProfileExposeDto> {
    if (!userId) {
      throw new NullProfileIdException();
    }
    const profile = await this.profileModel
      .findOne({ user_id: userId.toString(), is_deleted: false })
      .exec();
    if (!profile || profile.is_deleted) {
      throw new ProfileNotFoundException(userId);
    } else {
      return plainToInstance(ProfileExposeDto, profile, {
        excludeExtraneousValues: true,
      });
    }
  }

  /**
   * Créer un nouveau profile
   * @param dto
   */
  async create(dto: ProfileCreateDto): Promise<ProfileDocument> {
    if (!dto) {
      throw new ProfileCreateException('Payload invalide');
    }
    const existing = await this.profileModel.findOne({ user_id: dto.user_id });

    if (existing) {
      throw new BadRequestException(
        `Un profil existe déjà pour l'utilisateur ${dto.user_id}`,
      );
    }
    this.logger.log('✅ Requête reçue => create profiles MongoDB');
    try {
      return await this.profileModel.create(dto);
    } catch (err) {
      this.logger.error('Erreur create()', err);
      const errorMessage =
        err && typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message: string }).message
          : String(err);
      throw new ProfileCreateException(errorMessage);
    }
  }

  /**
   * MAJ un profile existant à partir de son ID
   * @param id
   * @param profile
   */
  async update(
    id: string,
    profile: ProfileUpdateDto,
  ): Promise<ProfileDocument> {
    this.logger.log(
      `🔄 Mise à jour du profil ${id} avec : ${JSON.stringify(profile)}`,
    );

    if (!id) {
      throw new NullProfileIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidProfilIdException(id);
    }

    await this.findProfileById(id);

    try {
      const updated = await this.profileModel
        .findByIdAndUpdate(id, { $set: profile }, { new: true })
        .exec();

      if (!updated) {
        this.logger.warn(`Profil ${id} introuvable lors de l'update`);
        throw new ProfileNotFoundException(id);
      }
      return updated;
    } catch (err) {
      if (err instanceof ProfileNotFoundException) {
        throw err;
      }
      this.logger.error('❌ Erreur lors de la mise à jour du profil', err);
      const errorMessage =
        err && typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message: string }).message
          : String(err);
      throw new ProfileInterneErrorException(errorMessage);
    }
  }

  /**
   * Supprimer un profile existant à partir de son ID
   * @param id
   */
  async removeSoft(id: string): Promise<ProfileDocument> {
    this.logger.log(
      "✅ Requête reçue => removeSoft profile MongoDB, avec l'ID: " + id,
    );

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
   * Affecter un badge à un profile
   */
  async addBadgeToProfile(
    profileId: string,
    profileBadge: ProfileBadgeDto,
  ): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById(profileId);
    if (!profile) throw new Error('Profil non trouvé');

    // Vérifie si déjà présent
    const existing = profile.badges.find(
      (pb) => pb.badge.toString() === profileBadge.badge.toString(),
    );
    if (existing) {
      throw new Error('Badge déjà acquis par ce profil');
    }

    // Ajoute le badgeProfile avec le badge
    profile.badges.push({
      badge: new Types.ObjectId(profileBadge.badge),
      date_earned: profileBadge.date_earned
        ? new Date(profileBadge.date_earned)
        : new Date(),
      progress: profileBadge.progress ?? 0,
      status: profileBadge.status ?? 'Non acquis',
    });

    return await profile.save();
  }

  /**
   * Méthode interne - Recherche Profile par ID
   * @param id
   * @private
   */
  private async findProfileById(
    id: string,
  ): Promise<HydratedDocument<Profile>> {
    if (!id) {
      throw new InvalidProfilIdException(id);
    }

    const profile = await this.profileModel
      .findById(id)
      .populate({ path: 'branch', populate: { path: 'badges' } })
      .lean()
      .exec();
    if (!profile) {
      throw new ProfileNotFoundException(id);
    }

    return profile;
  }
}
