import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadgeService } from '../services/badge.service';
import { Badge } from '../schema/badge.schema';
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

  const mockBadgeDocument = {
    _id: new Types.ObjectId(),
    first_name: 'Jean',
    last_name: 'Dupont',
    date_of_birth: new Date('1995-06-15'),
    address: '12 rue de la paix',
    city: 'Lille',
    zipcode: '59211',
    email: 'jean.dupont@email.com',
    phone_number: '+33605040302',
    branch: new Types.ObjectId(),
    is_deleted: false,
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
    expect(badgeModel.find).toHaveBeenCalledWith({ is_deleted: { $ne: true } });
  });

  it('GetID => OK', async () => {
    const result = await service.getById(mockBadgeDocument._id.toString());
    expect(result).toEqual(mockBadgeDocument);
    expect(badgeModel.findById).toHaveBeenCalledWith(
      mockBadgeDocument._id.toString(),
    );
  });

  it('GetID => Exception: Badge not Found', async () => {
    jest.spyOn(badgeModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    await expect(service.getById('111111111111111111111111')).rejects.toThrow(
      BadgeNotFoundException,
    );
  });

  it('GetID => Exception: ID null', async () => {
    await expect(service.remove(undefined as any)).rejects.toThrow(
      NullBadgeIdException,
    );
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

    await expect(service.create(null as any)).rejects.toThrow(
      BadgeCreateException,
    );
  });

  it('Create => Exception: date invalide', async () => {
    const invalidDto = {
      name: 'Created Name',
      description: 'Je suis une description de badge',
      progress: 50,
      logo_url: 'urlLogo',
      dateEarned: 'pouet',
      status: 'earned',
      branch: '',
    } as any;

    jest.spyOn(badgeModel, 'create').mockImplementation(() => {
      throw new Error('Invalid date format');
    });

    await expect(service.create(invalidDto)).rejects.toThrow(
      BadgeCreateException,
    );
  });

  it('Update => OK', async () => {
    const id = '6842e91c349d654ce1845b04'; // Simulated string ID
    const updateDto: BadgeUpdateDto = {
      name: 'Updated Name',
    } as BadgeUpdateDto;

    const result = await service.update(id, updateDto);

    expect(result).toEqual(mockBadgeDocument);

    // Vérifie que la méthode a été appelée avec les bons arguments
    expect(badgeModel.findByIdAndUpdate).toHaveBeenCalledWith(
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

    await expect(service.update(null as any, updateDto)).rejects.toThrow(
      NullBadgeIdException,
    );
  });

  it('Update => Exception: Payload null', async () => {
    const id = '6842eb694bb5600315b02240';

    jest.spyOn(badgeModel, 'findByIdAndUpdate').mockImplementation(() => {
      throw new Error('Payload invalid');
    });

    await expect(service.update(id, null as any)).rejects.toThrow(
      BadgeInterneErrorException,
    );
  });

  it('Delete => OK', async () => {
    jest.spyOn(mockBadgeDocument, 'save').mockResolvedValueOnce({
      ...mockBadgeDocument,
      is_deleted: true,
      removed_at: new Date(),
    });

    const result = await service.remove(mockBadgeDocument._id.toString());
    expect(result.is_deleted).toBe(true);
    expect(result.removed_at).toBeDefined();
    expect(badgeModel.findById).toHaveBeenCalledWith(
      mockBadgeDocument._id.toString(),
    );
    expect(mockBadgeDocument.save).toHaveBeenCalled();
  });

  it('Delete => Exception: Badge not found', async () => {
    jest.spyOn(badgeModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.remove('111111111111111111111111')).rejects.toThrow(
      BadgeNotFoundException,
    );
  });

  it('Delete => Exception: ID null', async () => {
    await expect(service.remove(undefined as any)).rejects.toThrow(
      NullBadgeIdException,
    );
  });

  it('Delete => Exception: ID vide', async () => {
    await expect(service.remove('')).rejects.toThrow(NullBadgeIdException);
  });
});
