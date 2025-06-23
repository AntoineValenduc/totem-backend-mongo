import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, isValidObjectId, Model } from 'mongoose';
import {
  BranchCreateException,
  BranchInterneErrorException,
  BranchNotFoundException,
  InvalidBranchIdException,
  InvalidBranchPayloadException,
  NullBranchIdException,
} from '../shared/exceptions/branch.exception';
import { Branch, BranchDocument } from '../schema/branch.schema';
import { BrancheCreateDto } from '../shared/dto/branche-create.dto';
import { BrancheUpdateDto } from '../shared/dto/branche-update.dto';

@Injectable()
export class BranchService {
  private readonly logger = new Logger(BranchService.name);

  constructor(
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
  ) {}

  /**
   * Afficher la liste des branchs
   */
  async findAll(): Promise<BranchDocument[]> {
    this.logger.log('✅ Requête reçue => findAll branchs MongoDB');
    try {
      return await this.branchModel.find({ is_deleted: { $ne: true } }).exec();
    } catch (err) {
      this.logger.error('❌ Erreur lors du findAll() dans le service', err);
      throw new BranchInterneErrorException(
        'Liste des Branches : ' + err.message + '',
      );
    }
  }

  /**
   * Afficher un branch à partir de son ID
   * @param id
   */
  async getById(id: string): Promise<BranchDocument> {
    this.logger.log(
      "✅ Requête reçue => getById branchs MongoDB, avec l'ID: " + id,
    );
    if (!id) {
      throw new NullBranchIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidBranchIdException(id);
    } else {
      return await this.findBranchById(id);
    }
  }

  /**
   * Créer un nouveau branch
   * @param dto
   */
  async create(dto: BrancheCreateDto): Promise<BranchDocument> {
    this.logger.log('✅ Requête reçue => create branchs MongoDB');
    try {
      return await this.branchModel.create(dto);
    } catch (err) {
      this.logger.error('Erreur create()', err);
      throw new BranchCreateException(err.message);
    }
  }

  /**
   * MAJ un branch existant à partir de son ID
   * @param id
   * @param branch
   */
  async update(id: string, branch: BrancheUpdateDto): Promise<BranchDocument> {
    this.logger.log(
      `🔄 Mise à jour du branche ${id} avec : ${JSON.stringify(branch)}`,
    );

    await this.validateId(id);
    await this.findBranchById(id);
    if (!branch) {
      throw new InvalidBranchPayloadException(branch);
    }

    return await this.branchModel
      .findByIdAndUpdate(id, { $set: branch }, { new: true })
      .exec()
      .then((updated) => {
        if (!updated) {
          throw new BranchNotFoundException(id);
        }
        return updated;
      });
  }

  /**
   * Supprimer un branch existant à partir de son ID
   * @param id
   */
  async remove(id: string): Promise<BranchDocument> {
    this.logger.log(
      "✅ Requête reçue => remove branch MongoDB, avec l'ID: " + id,
    );

    if (!id) {
      throw new NullBranchIdException();
    } else if (!isValidObjectId(id)) {
      throw new InvalidBranchIdException(id);
    } else {
      const branch = await this.findBranchById(id);
      branch.is_deleted = true;
      branch.removed_at = new Date();
      return await branch.save();
    }
  }

  /**
   * Mérhode interne - Recherche Branch par ID
   * @param id
   * @private
   */
  private async findBranchById(id: string): Promise<HydratedDocument<Branch>> {
    if (!id) {
      throw new InvalidBranchIdException(id);
    }

    const branch = await this.branchModel.findById(id).exec();
    if (!branch || branch.is_deleted) {
      throw new BranchNotFoundException(id);
    }

    return branch;
  }

  private async validateId(id: string) {
    if (!id) throw new NullBranchIdException();
    if (!isValidObjectId(id)) throw new InvalidBranchIdException(id);
  }
}
