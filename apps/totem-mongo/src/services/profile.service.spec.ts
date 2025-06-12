import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfileUpdateDto } from '../shared/dto/profile-update.dto';
import { Profile } from '../schema/profile.schema';
import { ProfileService } from './profile.service';
import {
  NullProfileIdException, ProfileCreateException, ProfileInterneErrorException,
  ProfileNotFoundException,
} from '../shared/exceptions/profile.exception';
import { ProfileCreateDto } from 'totem-mongo/src/shared/dto/profile-create.dto';

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
    mail: 'jean.dupont@email.com',
    phone_number: '+33605040302',
    branch: new Types.ObjectId(),
    is_deleted: false,
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockProfileModel = {
      find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockProfileDocument]) }),
      findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProfileDocument) }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProfileDocument) }),
      create: jest.fn().mockResolvedValue(mockProfileDocument),
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

  it('Liste => OK', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockProfileDocument]);
    expect(profileModel.find).toHaveBeenCalledWith({ is_deleted: { $ne: true } });
  });

  it('GetID => OK', async () => {
    const result = await service.getById(mockProfileDocument._id.toString());
    expect(result).toEqual(mockProfileDocument);
    expect(profileModel.findById).toHaveBeenCalledWith(mockProfileDocument._id.toString());
  });

  it('GetID => Exception: Profile not Found', async () => {
    jest.spyOn(profileModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    await expect(service.getById("111111111111111111111111")).rejects.toThrow(ProfileNotFoundException);
  });

  it('GetID => Exception: ID null', async () => {
    await expect(service.remove(undefined as any)).rejects.toThrow(NullProfileIdException);
  });

  it('Create => OK', async () => {
    const createDto: ProfileCreateDto = {
      firstName: 'Created FName',
      lastName: 'Created Name',
      city: 'Villeville',
      address: '200 rue du dév',
      zipcode: '12345',
      mail: 'adresse.mail@mail.fr',
      dateOfBirth: new Date('2025-06-09'),
      phoneNumber: '0605040302',
      branch: ""
    } as ProfileCreateDto;

    const mockProfile = { _id: 'mockId', ...createDto };

    jest.spyOn(profileModel, 'create').mockResolvedValueOnce(mockProfile as any);

    const result = await service.create(createDto);

    expect(result).toEqual(mockProfile);

  })

  it('Create => Exception: payload null', async () => {
    jest.spyOn(profileModel, 'create').mockImplementation(() => {
      throw new Error('Payload invalide');
    });

    await expect(service.create(null as any)).rejects.toThrow(ProfileCreateException);
  });

  it('Create => Exception: date invalide', async () => {
    const invalidDto = {
      firstName: 'Invalid FName',
      lastName: 'Invalid Name',
      city: 'Nocity',
      address: '404 nowhere',
      zipcode: 'ABCDE',
      mail: 'invalid.email@fail',
      dateOfBirth: 'not-a-date', // ⚠️ ici c’est une string invalide
      phoneNumber: 'not-a-phone',
      branch: ''
    } as any;

    jest.spyOn(profileModel, 'create').mockImplementation(() => {
      throw new Error('Invalid date format');
    });

    await expect(service.create(invalidDto)).rejects.toThrow(ProfileCreateException);
  });


  it('Update => OK', async () => {
    const id = '6842e91c349d654ce1845b04'; // Simulated string ID
    const updateDto: ProfileUpdateDto = {
      firstName: 'Updated Name',
    } as ProfileUpdateDto;

    const result = await service.update(id, updateDto);

    expect(result).toEqual(mockProfileDocument);

    // Vérifie que la méthode a été appelée avec les bons arguments
    expect(profileModel.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      { $set: updateDto },
      { new: true },
    );
  });


  it('Update => Exception: Profil not Found', async () => {
    const id = '6842eb694bb5600315b02240';
    const updateDto: ProfileUpdateDto = {
      firstName: 'Updated Name',
    } as ProfileUpdateDto;

    (profileModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.update(id, updateDto)).rejects.toThrow(
      `Profil avec l'ID ${id} introuvable`,
    );
  });

  it('Update => Exception: ID null', async () => {
    const updateDto: ProfileUpdateDto = {
      firstName: 'Updated Name',
    } as ProfileUpdateDto;

    await expect(service.update(null as any, updateDto)).rejects.toThrow(NullProfileIdException);
  });

  it('Update => Exception: Payload null', async () => {
    const id = '6842eb694bb5600315b02240';

    jest.spyOn(profileModel, 'findByIdAndUpdate').mockImplementation(() => {
      throw new Error('Payload invalid');
    });

    await expect(service.update(id, null as any)).rejects.toThrow(ProfileInterneErrorException);
  });

  it('Delete => OK', async () => {
    jest.spyOn(mockProfileDocument, 'save').mockResolvedValueOnce({
      ...mockProfileDocument,
      is_deleted: true,
      removed_at: new Date(),
    });

    const result = await service.remove(mockProfileDocument._id.toString());
    expect(result.is_deleted).toBe(true);
    expect(result.removed_at).toBeDefined();
    expect(profileModel.findById).toHaveBeenCalledWith(mockProfileDocument._id.toString());
    expect(mockProfileDocument.save).toHaveBeenCalled();
  });

  it('Delete => Exception: Profile not found', async () => {
    jest.spyOn(profileModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.remove('111111111111111111111111')).rejects.toThrow(ProfileNotFoundException);
  });

  it('Delete => Exception: ID null', async () => {
    await expect(service.remove(undefined as any)).rejects.toThrow(NullProfileIdException);
  });

  it('Delete => Exception: ID vide', async () => {
    await expect(service.remove('')).rejects.toThrow(NullProfileIdException);
  });

});