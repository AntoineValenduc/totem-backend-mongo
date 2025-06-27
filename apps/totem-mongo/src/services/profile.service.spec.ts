/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfileUpdateDto } from '../shared/dto/profile-update.dto';
import { Profile } from '../schema/profile.schema';
import { ProfileService } from './profile.service';
import {
  InvalidProfilIdException,
  NullProfileIdException,
  ProfileCreateException,
  ProfileInterneErrorException,
  ProfileNotFoundException,
} from '../shared/exceptions/profile.exception';
import { ProfileCreateDto } from '../shared/dto/profile-create.dto';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileModel: Model<Profile>;

  const mockProfileDocument = {
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
    const mockProfileModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProfileDocument]),
      }),
      findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProfileDocument),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProfileDocument),
      }),
      create: jest.fn().mockResolvedValue(mockProfileDocument),
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken(Profile.name),
          useValue: mockProfileModel,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileModel = module.get<Model<Profile>>(getModelToken(Profile.name));
  });

  it('findAll => OK', async () => {
    const spyFind = jest.spyOn(profileModel, 'find');
    const result = await service.findAll();
    expect(spyFind).toHaveBeenCalledWith({ is_deleted: false });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toMatchObject({
      first_name: mockProfileDocument.first_name,
      last_name: mockProfileDocument.last_name,
      city: mockProfileDocument.city,
      email: mockProfileDocument.email,
      is_deleted: false,
    });
  });

  it('getById => OK', async () => {
    const idStr = mockProfileDocument._id.toString();

    const result = await service.getById(idStr);

    expect(result).toEqual(
      expect.objectContaining({
        first_name: mockProfileDocument.first_name,
        last_name: mockProfileDocument.last_name,
        date_of_birth: mockProfileDocument.date_of_birth,
        address: mockProfileDocument.address,
        city: mockProfileDocument.city,
        zipcode: mockProfileDocument.zipcode,
        email: mockProfileDocument.email,
        phone_number: mockProfileDocument.phone_number,
        is_deleted: mockProfileDocument.is_deleted,
        id: idStr,
        branch: expect.objectContaining({ id: mockProfileDocument.branch.toString() }),
      }),
    );

    const spyFindById = jest.spyOn(profileModel, 'findById');
    expect(spyFindById).toHaveBeenCalledWith(idStr);
  });

  it('getById => Exception ProfileNotFoundException', async () => {
    jest.spyOn(profileModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    await expect(service.getById(new Types.ObjectId().toString())).rejects.toThrow(ProfileNotFoundException);
  });

  it('getById => Exception NullProfileIdException si id null ou vide', async () => {
    await expect(service.getById('')).rejects.toThrow(NullProfileIdException);
    await expect(service.getById(null as any)).rejects.toThrow(NullProfileIdException);
  });

  it('getById => Exception InvalidProfilIdException si id invalide', async () => {
    await expect(service.getById('invalid-id')).rejects.toBeInstanceOf(InvalidProfilIdException);
  });

  it('create => OK', async () => {
    const createDto: ProfileCreateDto = {
      first_name: 'Created FName',
      last_name: 'Created Name',
      city: 'Villeville',
      address: '200 rue du dév',
      zipcode: '12345',
      email: 'adresse.mail@mail.fr',
      date_of_birth: new Date('2025-06-09'),
      phone_number: '0605040302',
      branch: '',
      user_id: 'user123',
    };

    const mockProfile = {
      _id: new Types.ObjectId(),
      ...createDto,
      save: jest.fn(),
      is_deleted: false,
    } as any;

    jest.spyOn(profileModel, 'create').mockResolvedValueOnce(mockProfile);
    jest.spyOn(profileModel, 'findOne').mockResolvedValueOnce(null);

    const result = await service.create(createDto);
    expect(result).toEqual(mockProfile);
  });

  it('create => Exception ProfileCreateException (payload null)', async () => {
    await expect(service.create(null as any)).rejects.toThrow(ProfileCreateException);
  });

  it('create => Exception BadRequestException (profil existant)', async () => {
    jest.spyOn(profileModel, 'findOne').mockResolvedValueOnce(mockProfileDocument as any);
    await expect(service.create({ user_id: 'user123' } as any)).rejects.toThrowError(/Un profil existe déjà/);
  });

  it('create => Exception ProfileCreateException (erreur mongoose)', async () => {
    jest.spyOn(profileModel, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(profileModel, 'create').mockImplementation(() => { throw new Error('Invalid date format'); });
    await expect(service.create({ user_id: 'user123' } as any)).rejects.toThrow(ProfileCreateException);
  });

  it('update => OK', async () => {
    const id = new Types.ObjectId().toString();
    const updateDto: ProfileUpdateDto = {
      first_name: 'Updated Name',
    };

    jest.spyOn(profileModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockProfileDocument),
    } as any);

    const spyFindByIdAndUpdate = jest.spyOn(profileModel, 'findByIdAndUpdate');
    const result = await service.update(id, updateDto);
    expect(spyFindByIdAndUpdate).toHaveBeenCalledWith(id, { $set: updateDto }, { new: true });
    expect(result).toEqual(mockProfileDocument);
  });

  it('update => Exception ProfileNotFoundException', async () => {
    jest.spyOn(profileModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockProfileDocument),
    } as any);
    jest.spyOn(profileModel, 'findByIdAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    const id = new Types.ObjectId().toString();
    await expect(service.update(id, { first_name: 'Name' })).rejects.toThrow(ProfileNotFoundException);
  });

  it('update => Exception NullProfileIdException', async () => {
    await expect(service.update('', { first_name: 'Name' } as any)).rejects.toThrow(NullProfileIdException);
  });

  it('update => Exception InvalidProfilIdException', async () => {
    await expect(service.update('invalid-id', { first_name: 'Name' } as any)).rejects.toBeInstanceOf(InvalidProfilIdException);
  });

  it('update => Exception ProfileInterneErrorException (erreur mongoose)', async () => {
    jest.spyOn(profileModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockProfileDocument),
    } as any);

    jest.spyOn(profileModel, 'findByIdAndUpdate').mockImplementation(() => { throw new Error('Payload invalid'); });

    const id = new Types.ObjectId().toString();
    await expect(service.update(id, null as any)).rejects.toThrow(ProfileInterneErrorException);
  });

  it('removeSoft => OK', async () => {
    const idStr = mockProfileDocument._id.toString();

    const mockProfileWithSave = {
      ...mockProfileDocument,
      is_deleted: false,
      save: jest.fn().mockResolvedValue({
        ...mockProfileDocument,
        is_deleted: true,
        removed_at: new Date(),
      }),
    };

    jest.spyOn(profileModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockProfileWithSave),
    } as any);

    const result = await service.removeSoft(idStr);
    expect(result.is_deleted).toBe(true);
    expect(result.removed_at).toBeDefined();
    expect(mockProfileWithSave.save).toHaveBeenCalled();
  });

  it('removeSoft => Exception ProfileNotFoundException', async () => {
    jest.spyOn(profileModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.removeSoft(new Types.ObjectId().toString())).rejects.toThrow(ProfileNotFoundException);
  });

  it('removeSoft => Exception NullProfileIdException si id null ou vide', async () => {
    await expect(service.removeSoft('')).rejects.toThrow(NullProfileIdException);
    await expect(service.removeSoft(null as any)).rejects.toThrow(NullProfileIdException);
  });

  it('removeSoft => Exception InvalidProfilIdException si id invalide', async () => {
    await expect(service.removeSoft('invalid-id')).rejects.toBeInstanceOf(InvalidProfilIdException);
  });
});
