/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadgeService } from '../services/badge.service';
import { Badge, BadgeDocument } from '../schema/badge.schema';
import {
  BadgeCreateException,
  BadgeInterneErrorException,
  BadgeNotFoundException,
  NullBadgeIdException,
} from '../shared/exceptions/badge.exception';
import { BadgeCreateDto } from '../shared/dto/badge-create.dto';
import { BadgeUpdateDto } from '../shared/dto/badge-update.dto';

describe('BadgeService', () => {
  let service: BadgeService;
  let badgeModel: Model<Badge>;

  const mockBadgeDocument: Partial<BadgeDocument> = {
    _id: new Types.ObjectId(),
    name: 'Badge Test',
    description: 'Ceci est un badge de test',
    logo_url: 'https://example.com/logo.png',
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockBadgeModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockBadgeDocument]),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBadgeDocument),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
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
    badgeModel = module.get<Model<Badge>>(getModelToken(Badge.name));
  });

  it('Liste => OK', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockBadgeDocument]);
    const spy = jest.spyOn(badgeModel, 'find');
    expect(spy).toHaveBeenCalledWith({ is_deleted: { $ne: true } });
  });

  it('GetID => OK', async () => {
    const result = await service.getById(mockBadgeDocument._id!.toString());
    expect(result).toEqual(mockBadgeDocument);
    const spy = jest.spyOn(badgeModel, 'findById');
    expect(spy).toHaveBeenCalledWith(mockBadgeDocument._id!.toString());
  });

  it('GetID => Exception: Badge not Found', async () => {
    jest.spyOn(badgeModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as unknown as import('mongoose').Query<unknown, Badge>);
    await expect(service.getById('111111111111111111111111')).rejects.toThrow(
      BadgeNotFoundException,
    );
  });

  it('GetID => Exception: ID null', async () => {
    await expect(service.remove('')).rejects.toThrow(NullBadgeIdException);
  });

  it('Create => OK', async () => {
    const createDto: BadgeCreateDto = {
      name: 'Created Name',
      description: 'Je suis une description de badge',
      progress: 50,
      logo_url: 'urlLogo',
      dateEarned: new Date('2025-06-09'),
      status: 'earned',
      branch: '',
    } as BadgeCreateDto;

    const mockBadge = { _id: 'mockId', ...createDto };

    jest.spyOn(badgeModel, 'create').mockResolvedValueOnce(mockBadge as any);

    const result = await service.create(createDto);

    expect(result).toEqual(mockBadge);
  });

  it('Create => Exception: payload null', async () => {
    jest.spyOn(badgeModel, 'create').mockImplementation(() => {
      throw new Error('Payload invalide');
    });

    await expect(
      service.create(null as unknown as BadgeCreateDto),
    ).rejects.toThrow(BadgeCreateException);
  });

  it('Create => Exception: date invalide', async () => {
    const invalidDto: BadgeCreateDto = {
      name: 'Created Name',
      description: 'Je suis une description de badge',
      logo_url: 'urlLogo',
      branch: '',
    };

    jest.spyOn(badgeModel, 'create').mockImplementation(() => {
      throw new Error('Invalid date format');
    });

    await expect(service.create(invalidDto)).rejects.toThrow(
      BadgeCreateException,
    );
  });

  it('Update => OK', async () => {
    const id = '6842e91c349d654ce1845b04';
    const updateDto: BadgeUpdateDto = {
      name: 'Updated Name',
    } as BadgeUpdateDto;

    const result = await service.update(id, updateDto);

    expect(result).toEqual(mockBadgeDocument);

    const findByIdAndUpdateSpy = jest.spyOn(badgeModel, 'findByIdAndUpdate');
    expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
      id,
      { $set: updateDto },
      { new: true },
    );
  });

  it('Update => Exception: Badge not Found', async () => {
    const id = '6842eb694bb5600315b02240';
    const updateDto: BadgeUpdateDto = {
      name: 'Updated Name',
    } as BadgeUpdateDto;

    (badgeModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.update(id, updateDto)).rejects.toThrow(
      `Badge avec l'ID ${id} introuvable`,
    );
  });

  it('Update => Exception: ID null', async () => {
    const updateDto: BadgeUpdateDto = {
      name: 'Updated Name',
    } as BadgeUpdateDto;

    await expect(service.update('' as string, updateDto)).rejects.toThrow(
      NullBadgeIdException,
    );
  });

  it('Update => Exception: Payload null', async () => {
    const id = '6842eb694bb5600315b02240';

    jest.spyOn(badgeModel, 'findByIdAndUpdate').mockImplementation(() => {
      throw new Error('Payload invalid');
    });

    await expect(
      service.update(id, null as unknown as BadgeUpdateDto),
    ).rejects.toThrow(BadgeInterneErrorException);
  });
});
