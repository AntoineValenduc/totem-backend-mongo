import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument, isValidObjectId } from 'mongoose';
import { Badge, BadgeDocument } from '../schema/badge.schema';
import {
  BadgeCreateException,
  BadgeInterneErrorException,
  BadgeNotFoundException,
  InvalidBadgeIdException,
  NullBadgeIdException,
} from '../shared/exceptions/badge.exception';
import { BadgeCreateDto } from '../shared/dto/badge-create.dto';
import { BadgeUpdateDto } from '../shared/dto/badge-update.dto';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(
    @InjectModel(Badge.name) private readonly badgeModel: Model<Badge>,
  ) {}

  /**
   * Afficher la liste des profiles
   */
  async findAll(): Promise<BadgeDocument[]> {
    this.logger.log('✅ Requête reçue => findAll profiles MongoDB');
    try {
      return await this.badgeModel.find({ is_deleted: { $ne: true } }).exec();
    } catch (err) {
      this.logger.error('❌ Erreur lors du findAll() dans le service', err);
      throw new BadgeInterneErrorException(
        'Liste des Profils : ' +
          (err && typeof err === 'object' && err !== null && 'message' in err
            ? (err as { message?: string }).message
            : String(err)) +
          '',
      );
    }
  }

  /**
   * Afficher la liste des profiles soft-deleted
   */
  async findAllSoftDeleted(): Promise<BadgeDocument[]> {
    this.logger.log(
      '✅ SERVICE Requête reçue => findAllSoftDeleted badges MongoDB',
    );
    try {
      return this.badgeModel.find({ is_deleted: { $ne: false } }).exec();
    } catch (err) {
      this.logger.error(
        '❌ Erreur lors du findAllSoftDeleted() dans le service',
        err,
      );
      throw new BadgeInterneErrorException(
        'Liste des Badges Soft-Deleted: ' +
          (err && typeof err === 'object' && err !== null && 'message' in err
            ? (err as { message?: string }).message
            : String(err)) +
          '',
      );
    }
  }

  /**
   * Afficher un badge à partir de son ID
   * @param id
   */
  async getById(id: string): Promise<BadgeDocument> {
    this.logger.log(
      "✅ Requête reçue => getById badges MongoDB, avec l'ID: " + id,
    );
    if (!id) {
      throw new NullBadgeIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidBadgeIdException(id);
    } else {
      return await this.findBadgeById(id);
    }
  }

  /**
   * Créer un nouveau badge
   * @param dto
   */
  async create(dto: BadgeCreateDto): Promise<BadgeDocument> {
    this.logger.log('✅ Requête reçue => create badges MongoDB');
    try {
      return await this.badgeModel.create(dto);
    } catch (err) {
      this.logger.error('Erreur create()', err);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : String(err);
      throw new BadgeCreateException(message);
    }
  }

  /**
   * MAJ un badge existant à partir de son ID
   * @param id
   * @param badge
   */
  async update(id: string, badge: BadgeUpdateDto): Promise<BadgeDocument> {
    this.logger.log(
      `🔄 Mise à jour du badge ${id} avec : ${JSON.stringify(badge)}`,
    );

    if (!id) {
      throw new NullBadgeIdException();
    }

    if (!isValidObjectId(id)) {
      throw new InvalidBadgeIdException(id);
    }

    await this.findBadgeById(id); // Lève déjà une erreur si introuvable

    try {
      const updated = await this.badgeModel
        .findByIdAndUpdate(id, { $set: badge }, { new: true })
        .exec();

      if (!updated) {
        this.logger.warn(`⚠️ Badge ${id} introuvable lors de l'update`);
        throw new BadgeNotFoundException(id);
      }

      return updated;
    } catch (err) {
      this.logger.error('Erreur update()', err);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : String(err);
      throw new BadgeInterneErrorException(message);
    }
  }

  /**
   * Supprimer un badge existant à partir de son ID
   * @param id
   */
  async remove(id: string): Promise<BadgeDocument> {
    this.logger.log(
      "✅ Requête reçue => remove badge MongoDB, avec l'ID: " + id,
    );

    if (!id) {
      throw new NullBadgeIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidBadgeIdException(id);
    } else {
      const badge = await this.findBadgeById(id);
      badge.is_deleted = true;
      badge.removed_at = new Date();
      return await badge.save();
    }
  }

  /**
   * Mérhode interne - Recherche Badge par ID
   * @param id
   * @private
   */
  private async findBadgeById(id: string): Promise<HydratedDocument<Badge>> {
    if (!id) {
      throw new InvalidBadgeIdException(id);
    }

    const badge = await this.badgeModel.findById(id).exec();
    if (!badge || badge.is_deleted) {
      throw new BadgeNotFoundException(id);
    }

    return badge;
  }
}
