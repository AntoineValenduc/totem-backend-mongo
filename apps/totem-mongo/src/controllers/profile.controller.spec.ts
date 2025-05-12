import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from '../services/profile.service';
import { CreateProfileDto } from '../shared/dto/create-profile.dto';

describe('ProfileController', () => {
  let profileController: ProfileController;
  //let profileService: ProfileService;

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
          },
        },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
    //profileService = module.get<ProfileService>(ProfileService);
  });

  it('should return all profiles', async () => {
    await expect(profileController.findAll()).resolves.toEqual([]);
  });

  it('should return profile by ID', async () => {
    await expect(profileController.getById('123')).resolves.toEqual({});
  });

  it('should throw an error if ID is missing in getById', async () => {
    return await expect(profileController.getById('')).rejects.toThrow(
      '❌ Requête reçue => ID is required',
    );
  });

  it('should create a new profile', async () => {
    const dto: CreateProfileDto = {
      name: 'Test Profile',
    } as unknown as CreateProfileDto;
    await expect(profileController.createProfile(dto)).resolves.toEqual({});
  });

  it('should update a profile', async () => {
    const dto: CreateProfileDto = {
      name: 'Updated Profile',
    } as unknown as CreateProfileDto;
    await expect(profileController.updateProfile('123', dto)).resolves.toEqual(
      {},
    );
  });

  it('should remove a profile', async () => {
    await expect(profileController.removeProfile('123')).resolves.toEqual({});
  });
});
