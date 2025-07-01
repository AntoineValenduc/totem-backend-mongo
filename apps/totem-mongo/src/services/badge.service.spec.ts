import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadgeService } from '../services/badge.service';
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

describe('BadgeService', () => {
  let service: BadgeService;
  let badgeModel: Model<BadgeDocument>;

  const mockBadgeDocument: Partial<BadgeDocument> = {
    _id: new Types.ObjectId(),
    name: 'Badge Test',
    description: 'Ceci est un badge de test',
    logo_url: 'https://example.com/logo.png',
    save: jest.fn(),
  };

  const mockBadgeExposeDto = {
  id: mockBadgeDocument._id!.toString(),
  name: mockBadgeDocument.name,
  description: mockBadgeDocument.description,
  logo_url: mockBadgeDocument.logo_url,
  branch: undefined,
};

  beforeEach(async () => {
    const mockBadgeModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBadgeDocument]),
      }),
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBadgeDocument),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBadgeDocument),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBadgeDocument),
      }),
      create: jest.fn().mockResolvedValue(mockBadgeDocument),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgeService,
        {
          provide: getModelToken(Badge.name),
          useValue: mockBadgeModel,
        },
      ],
    }).compile();

    service = module.get<BadgeService>(BadgeService);
    badgeModel = module.get<Model<BadgeDocument>>(getModelToken(Badge.name));
  });

  it('findAll => retourne la liste des badges', async () => {
    const spyFind = jest.spyOn(badgeModel, 'find');
    const result = await service.findAll();
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockBadgeExposeDto)]));
    expect(spyFind).toHaveBeenCalled();
  });

  it('getById => retourne un badge par ID', async () => {
    const spyFindById = jest.spyOn(badgeModel, 'findById');
    const idStr = mockBadgeDocument._id!.toString();
    const result = await service.getById(idStr);
    expect(result).toEqual(expect.objectContaining(mockBadgeExposeDto));
    expect(spyFindById).toHaveBeenCalledWith(idStr);
  });

  it('getById => lève BadgeNotFoundException si badge non trouvé', async () => {
    jest.spyOn(badgeModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.getById(new Types.ObjectId().toString())).rejects.toThrow(TypeError);
  });

  it('getById => lève NullBadgeIdException si ID null ou vide', async () => {
    await expect(service.getById('')).rejects.toThrow(NullBadgeIdException);
    await expect(service.getById(null as any)).rejects.toThrow(NullBadgeIdException);
  });

  it('getById => lève InvalidBadgeIdException si ID invalide', async () => {
    await expect(service.getById('invalid-id')).rejects.toThrow(InvalidBadgeIdException);
  });

  it('create => crée un badge', async () => {
    const createDto: BadgeCreateDto = {
      name: 'Created Name',
      description: 'Je suis une description de badge',
      logo_url: 'urlLogo',
      branch: new Types.ObjectId().toHexString(),
    };

    const spyCreate = jest.spyOn(badgeModel, 'create');
    const result = await service.create(createDto);
    expect(spyCreate).toHaveBeenCalledWith({
      ...createDto,
      branch: expect.any(Types.ObjectId),
    });
    expect(result).toEqual(mockBadgeDocument);
  });

  it('create => lève BadgeCreateException si erreur', async () => {
    jest.spyOn(badgeModel, 'create').mockImplementation(() => {
      throw new Error('Erreur interne création');
    });

    await expect(service.create({
      name: 'Nom',
      description: 'Desc',
      branch: new Types.ObjectId().toHexString(),
      logo_url: ''
    })).rejects.toThrow(BadgeCreateException);
  });

  it('update => met à jour un badge', async () => {
    const id = new Types.ObjectId().toHexString();
    const updateDto: BadgeUpdateDto = {
      name: 'Updated Name',
    };

    const spyUpdate = jest.spyOn(badgeModel, 'findByIdAndUpdate');
    const result = await service.update(id, updateDto);

    expect(spyUpdate).toHaveBeenCalledWith(id, { $set: updateDto }, { new: true });
    expect(result).toEqual(mockBadgeDocument);
  });

  it('update => lève BadgeNotFoundException si badge introuvable', async () => {
    jest.spyOn(badgeModel, 'findByIdAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    const id = new Types.ObjectId().toHexString();
    const updateDto: BadgeUpdateDto = { name: 'Name' };

    await expect(service.update(id, updateDto)).rejects.toThrow(BadgeInterneErrorException);
  });

  it('update => lève NullBadgeIdException si ID null ou vide', async () => {
    await expect(service.update('', {} as any)).rejects.toThrow(NullBadgeIdException);
  });

  it('update => lève InvalidBadgeIdException si ID invalide', async () => {
    await expect(service.update('invalid-id', {} as any)).rejects.toThrow(InvalidBadgeIdException);
  });

  it('update => lève BadgeInterneErrorException si erreur interne', async () => {
    jest.spyOn(badgeModel, 'findByIdAndUpdate').mockImplementation(() => {
      throw new Error('Erreur interne');
    });

    const id = new Types.ObjectId().toHexString();

    await expect(service.update(id, {} as any)).rejects.toThrow(BadgeInterneErrorException);
  });

  it('remove => supprime un badge', async () => {
    const spyDelete = jest.spyOn(badgeModel, 'findByIdAndDelete');
    const id = new Types.ObjectId().toHexString();

    await expect(service.remove(id)).resolves.toBeUndefined();

    expect(spyDelete).toHaveBeenCalledWith(id);
  });

  it('remove => lève NullBadgeIdException si ID null ou vide', async () => {
    await expect(service.remove('')).rejects.toThrow(NullBadgeIdException);
  });

  it('remove => lève InvalidBadgeIdException si ID invalide', async () => {
    await expect(service.remove('invalid-id')).rejects.toThrow(InvalidBadgeIdException);
  });

  it('remove => lève BadgeNotFoundException si badge introuvable', async () => {
    jest.spyOn(badgeModel, 'findByIdAndDelete').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    const id = new Types.ObjectId().toHexString();
    await expect(service.remove(id)).rejects.toThrow(BadgeNotFoundException);
  });
});
