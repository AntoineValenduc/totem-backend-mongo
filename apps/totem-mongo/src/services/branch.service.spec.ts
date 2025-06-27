/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { BranchDocument } from '../schema/branch.schema';

describe('BranchService', () => {
  let service: BranchService;
  let branchModel: Model<BranchDocument>;

  // Important: on mocke avec _id et on s'assure que c'est un Types.ObjectId
  const mockBranchDocument: Partial<BranchDocument> = {
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
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBranchDocument]),
      }),
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
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
          provide: getModelToken('Branch'),
          useValue: mockBranchModel,
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);
    branchModel = module.get<Model<BranchDocument>>(getModelToken('Branch'));
  });

  it('findAll => OK', async () => {
    const result = await service.findAll();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockBranchDocument._id!.toString(),  // <- attention _id ici
          name: mockBranchDocument.name,
          description: mockBranchDocument.description,
          color: mockBranchDocument.color,
          range_age: mockBranchDocument.range_age,
        }),
      ]),
    );

    const spyFind = jest.spyOn(branchModel, 'find');
    expect(spyFind).toHaveBeenCalledWith({ is_deleted: false });
  });

  it('getById => OK', async () => {
    const idStr = mockBranchDocument._id!.toString();

    const result = await service.getById(idStr);

    expect(result).toEqual(
      expect.objectContaining({
        id: idStr,
        name: mockBranchDocument.name,
        description: mockBranchDocument.description,
        color: mockBranchDocument.color,
        range_age: mockBranchDocument.range_age,
      }),
    );

    const spyFindById = jest.spyOn(branchModel, 'findById');
    expect(spyFindById).toHaveBeenCalledWith(idStr);
  });

  it('getById => Exception BranchNotFoundException', async () => {
  jest.spyOn(branchModel, 'findById').mockReturnValueOnce({
    populate: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(null),
  } as any);

  const result = await service.getById(new Types.ObjectId().toString());
  expect(result).toBeNull();
});
  it('getById => Exception NullBranchIdException si id null ou vide', async () => {
    await expect(service.getById('')).rejects.toThrow(NullBranchIdException);
    await expect(service.getById(null as any)).rejects.toThrow(NullBranchIdException);
  });

  it('getById => Exception InvalidBranchIdException si id invalide', async () => {
    await expect(service.getById('invalid-id')).rejects.toThrowError("L'ID de la branche invalid-id est invalide");
  });

  it('create => OK', async () => {
    const createDto: BrancheCreateDto = {
      name: 'nom branche',
      color: 'blanc noiratre',
      range_age: '1-99',
      description: "Je suis une branche scout pas une branche d'arbre",
    };

    const spyCreate = jest.spyOn(branchModel, 'create');
    const result = await service.create(createDto);
    expect(spyCreate).toHaveBeenCalledWith(createDto);
    expect(result).toEqual(mockBranchDocument);
  });

  it('create => Exception BranchCreateException', async () => {
    jest.spyOn(branchModel, 'create').mockImplementation(() => {
      throw new Error('Payload invalide');
    });
    await expect(service.create(null as any)).rejects.toThrow(BranchCreateException);
  });

  it('update => OK', async () => {
    const id = new Types.ObjectId().toString();
    const updateDto: BrancheUpdateDto = {
      name: 'Updated Name',
    };

    const spyFindByIdAndUpdate = jest.spyOn(branchModel, 'findByIdAndUpdate');
    const result = await service.update(id, updateDto);

    expect(spyFindByIdAndUpdate).toHaveBeenCalledWith(id, { $set: updateDto }, { new: true });
    expect(result).toEqual(mockBranchDocument);
  });

  it('update => Exception BranchNotFoundException', async () => {
    jest.spyOn(branchModel, 'findByIdAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    const id = new Types.ObjectId().toString();
    const updateDto: BrancheUpdateDto = { name: 'Updated Name' };

    await expect(service.update(id, updateDto)).rejects.toThrow(BranchNotFoundException);
  });

  it('update => Exception NullBranchIdException si id null ou vide', async () => {
    const updateDto: BrancheUpdateDto = { name: 'Updated Name' };
    await expect(service.update('', updateDto)).rejects.toThrow(NullBranchIdException);
  });

  it('update => Exception InvalidBranchIdException si id invalide', async () => {
    const updateDto: BrancheUpdateDto = { name: 'Updated Name' };
    await expect(service.update('invalid-id', updateDto)).rejects.toThrowError("L'ID de la branche invalid-id est invalide");
  });

  it('update => Exception InvalidBranchPayloadException si payload null', async () => {
    const id = new Types.ObjectId().toString();

    jest.spyOn(branchModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockBranchDocument),
    } as any);

    await expect(service.update(id, null as any)).rejects.toThrow(InvalidBranchPayloadException);
  });

  it('remove => OK', async () => {
    const idStr = mockBranchDocument._id!.toString();

    jest.spyOn(branchModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({
        ...mockBranchDocument,
        is_deleted: false,
        save: jest.fn().mockResolvedValue({
          ...mockBranchDocument,
          is_deleted: true,
          removed_at: new Date(),
        }),
      }),
    } as any);

    const result = await service.remove(idStr);
    expect(result.is_deleted).toBe(true);
    expect(result.removed_at).toBeDefined();
  });

  it('remove => Exception BranchNotFoundException', async () => {
    jest.spyOn(branchModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.remove(new Types.ObjectId().toString())).rejects.toThrow(BranchNotFoundException);
  });

  it('remove => Exception NullBranchIdException si id null ou vide', async () => {
    await expect(service.remove('')).rejects.toThrow(NullBranchIdException);
    await expect(service.remove(null as any)).rejects.toThrow(NullBranchIdException);
  });

  it('remove => Exception InvalidBranchIdException si id invalide', async () => {
    await expect(service.remove('invalid-id')).rejects.toThrowError("L'ID de la branche invalid-id est invalide");
  });
});