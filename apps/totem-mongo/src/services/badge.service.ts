import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, Types } from 'mongoose';
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
import { BadgeExposeDto } from '../shared/dto/badge-expose.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(
    @InjectModel(Badge.name) private readonly badgeModel: Model<BadgeDocument>,
  ) {}

  /**
   * Afficher la liste des badges
   */
  async findAll(): Promise<BadgeExposeDto[]> {
    try {
      //Recherche Mongoose
      const badges = await this.badgeModel
        .find()
        .populate('branch')
        .lean()
        .exec();

      //Transco en DTO Expose
      return plainToInstance(BadgeExposeDto, badges, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      this.logger.error('Erreur lors du findAll() dans le service', err);
      throw new BadgeInterneErrorException(
        'Erreur lors de la récupération des badges',
      );
    }
  }

  /**
   * Afficher un badge à partir de son ID
   * @param id
   */
  async getById(id: string): Promise<BadgeExposeDto> {
    if (!id) {
      throw new NullBadgeIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidBadgeIdException(id);
    } else {
      const idObject = new Types.ObjectId(id);
      const badge = await this.badgeModel
        .findById(idObject)
        .populate('branch')
        .lean()
        .exec();
      if (!badge) {
        throw new BadgeNotFoundException(idObject.toString());
      }
      return plainToInstance(BadgeExposeDto, badge, {
        excludeExtraneousValues: true,
      });
    }
  }

  /**
   * Créer un nouveau badge
   * @param dto
   */
  async create(dto: BadgeCreateDto): Promise<BadgeDocument> {
    try {
      //Conversion ID Branch en ObjectId Mongoose
      const badgeToCreate = {
        ...dto,
        branch: new Types.ObjectId(dto.branch),
      };

      return await this.badgeModel.create(badgeToCreate);
    } catch (err) {
      this.logger.error('Erreur create()', err);
      throw new BadgeCreateException(
        err instanceof Error ? err.message : 'Erreur inconnue',
      );
    }
  }

  /**
   * MAJ un badge existant à partir de son ID
   * @param id
   * @param badge
   */
  async update(id: string, badge: BadgeUpdateDto): Promise<BadgeDocument> {
    if (!id) {
      throw new NullBadgeIdException();
    }
    if (!isValidObjectId(id)) {
      throw new InvalidBadgeIdException(id);
    }

    try {
      const updated = await this.badgeModel
        .findByIdAndUpdate(id, { $set: badge }, { new: true })
        .exec();

      if (!updated) {
        throw new BadgeNotFoundException(id);
      }

      return updated;
    } catch (err) {
      this.logger.error('Erreur update()', err);
      throw new BadgeInterneErrorException();
    }
  }

  /**
   * Supprimer un badge existant à partir de son ID
   * @param id
   */
  async remove(id: string): Promise<void> {
    if (!id) {
      throw new NullBadgeIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidBadgeIdException(id);
    } else {
      await this.badgeModel
        .findByIdAndDelete(id)
        .exec()
        .then((deletedBadge) => {
          if (!deletedBadge) {
            throw new BadgeNotFoundException(id);
          }
          return deletedBadge;
        });
    }
  }
}
