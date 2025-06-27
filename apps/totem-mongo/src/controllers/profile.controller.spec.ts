import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from '../services/profile.service';
import { ProfileCreateDto } from '../shared/dto/profile-create.dto';
import { ProfileUpdateDto } from '../shared/dto/profile-update.dto';

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            getById: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
            removeSoft: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
  });

  it('should return all profiles', async () => {
    await expect(profileController.findAll()).resolves.toEqual([]);
  });

  it('should return profile by ID', async () => {
    await expect(profileController.getById('123')).resolves.toEqual({});
  });

  it('should throw an error if ID is missing in getById', async () => {
    return await expect(profileController.getById('')).rejects.toThrow(
      'Requête reçue => ID is required',
    );
  });

  it('should create a new profile', async () => {
    const dto: ProfileCreateDto = {
      name: 'Test Profile',
    } as unknown as ProfileCreateDto;
    await expect(profileController.createProfile(dto)).resolves.toEqual({});
  });

  it('should update a profile', async () => {
    const dto: ProfileUpdateDto = {
      name: 'Updated Profile',
    } as unknown as ProfileUpdateDto;
    await expect(
      profileController.updateProfile({ id: '123', profile: dto }),
    ).resolves.toEqual({});
  });

  it('should remove a profile', async () => {
    await expect(profileController.removeProfile('123')).resolves.toEqual({});
  });
});
