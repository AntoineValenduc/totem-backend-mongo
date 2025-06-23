import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BranchService } from './branch.service';
import {
  NullBranchIdException,
  BranchCreateException,
  BranchNotFoundException,
  InvalidBranchPayloadException,
} from '../shared/exceptions/branch.exception';
import { BrancheCreateDto } from '../shared/dto/branche-create.dto';
import { BrancheUpdateDto } from '../shared/dto/branche-update.dto';
import { Branch } from '../schema/branch.schema';

describe('BranchService', () => {
  let service: BranchService;
  let branchModel: Model<Branch>;

  const mockBranchDocument = {
    _id: new Types.ObjectId(),
    name: 'nom branche',
    color: 'blanc noiratre',
    range_age: '1-99',
    description: "Je suis une branche scout pas une branche d'arbre",
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockBranchModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockBranchDocument]),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBranchDocument),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBranchDocument),
      }),
      create: jest.fn().mockResolvedValue(mockBranchDocument),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchService,
        {
          provide: getModelToken(Branch.name),
          useValue: mockBranchModel,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);
    branchModel = module.get<Model<Branch>>(getModelToken(Branch.name));
  });

  it('Liste => OK', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockBranchDocument]);
    const spy = jest.spyOn(branchModel, 'find');
    expect(spy).toHaveBeenCalledWith({
      is_deleted: { $ne: true },
    });
  });

  it('GetID => OK', async () => {
    const result = await service.getById(mockBranchDocument._id.toString());
    expect(result).toEqual(mockBranchDocument);
    const findByIdSpy = jest.spyOn(branchModel, 'findById');
    expect(findByIdSpy).toHaveBeenCalledWith(mockBranchDocument._id.toString());
  });

  it('GetID => Exception: Branch not Found', async () => {
    jest.spyOn(branchModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    await expect(service.getById('111111111111111111111111')).rejects.toThrow(
      BranchNotFoundException,
    );
  });

  it('GetID => Exception: ID null', async () => {
    await expect(
      service.remove(undefined as unknown as string),
    ).rejects.toThrow(NullBranchIdException);
  });

  it('Create => OK', async () => {
    const createDto: BrancheCreateDto = {
      name: 'nom branche',
      color: 'blanc noiratre',
      range_age: '1-99',
      description: "Je suis une branche scout pas une branche d'arbre",
    } as BrancheCreateDto;

    const mockBranch = {
      _id: new Types.ObjectId(),
      ...createDto,
      save: jest.fn(),
    } as unknown as Branch & { _id: Types.ObjectId; save: jest.Mock };

    jest.spyOn(branchModel, 'create').mockResolvedValueOnce(mockBranch as any);

    const result = await service.create(createDto);

    expect(result).toEqual(mockBranch);
  });

  it('Create => Exception: payload null', async () => {
    jest.spyOn(branchModel, 'create').mockImplementation(() => {
      throw new Error('Payload invalide');
    });

    await expect(service.create(null as any)).rejects.toThrow(
      BranchCreateException,
    );
  });

  it('Create => Exception: date invalide', async () => {
    const invalidDto: BrancheCreateDto = {
      name: 'nom branche',
      color: 'blanc noiratre',
      range_age: '1-99',
      description: "Je suis une branche scout pas une branche d'arbre",
    };

    jest.spyOn(branchModel, 'create').mockImplementation(() => {
      throw new Error('Invalid date format');
    });

    await expect(service.create(invalidDto)).rejects.toThrow(
      BranchCreateException,
    );
  });

  it('Update => OK', async () => {
    const id = '6842e91c349d654ce1845b04';
    const updateDto: BrancheUpdateDto = {
      firstName: 'Updated Name',
    } as BrancheUpdateDto;

    const result = await service.update(id, updateDto);

    expect(result).toEqual(mockBranchDocument);

    const findByIdAndUpdateSpy = jest.spyOn(branchModel, 'findByIdAndUpdate');
    expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
      id,
      { $set: updateDto },
      { new: true },
    );
  });

  it('Update => Exception: Branche not Found', async () => {
    const id = '6842eb694bb5600315b02240';
    const updateDto: BrancheUpdateDto = {
      firstName: 'Updated Name',
    } as BrancheUpdateDto;

    (branchModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.update(id, updateDto)).rejects.toThrow(
      `Branche avec l'ID ${id} introuvable`,
    );
  });

  it('Update => Exception: ID null', async () => {
    const updateDto: BrancheUpdateDto = {
      firstName: 'Updated Name',
    } as BrancheUpdateDto;

    await expect(service.update(null as any, updateDto)).rejects.toThrow(
      NullBranchIdException,
    );
  });

  it('Update => Exception: Payload null', async () => {
    const id = '6842eb694bb5600315b02240';

    jest.spyOn(branchModel, 'findByIdAndUpdate').mockImplementation(() => {
      throw new Error('Payload invalid');
    });

    await expect(service.update(id, null as any)).rejects.toThrow(
      InvalidBranchPayloadException,
    );
  });

  it('Delete => OK', async () => {
    jest.spyOn(mockBranchDocument, 'save').mockResolvedValueOnce({
      ...mockBranchDocument,
      is_deleted: true,
      removed_at: new Date(),
    });

    const result = await service.remove(mockBranchDocument._id.toString());
    expect(result.is_deleted).toBe(true);
    expect(result.removed_at).toBeDefined();
    const spy = jest.spyOn(branchModel, 'findById');
    expect(spy).toHaveBeenCalledWith(mockBranchDocument._id.toString());
    expect(mockBranchDocument.save).toHaveBeenCalled();
  });

  it('Delete => Exception: Branch not found', async () => {
    jest.spyOn(branchModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.remove('111111111111111111111111')).rejects.toThrow(
      BranchNotFoundException,
    );
  });

  it('Delete => Exception: ID null', async () => {
    await expect(service.remove(undefined as any)).rejects.toThrow(
      NullBranchIdException,
    );
  });

  it('Delete => Exception: ID vide', async () => {
    await expect(service.remove('')).rejects.toThrow(NullBranchIdException);
  });
});
