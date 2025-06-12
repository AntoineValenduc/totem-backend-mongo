import { PartialType } from '@nestjs/mapped-types';
import { ProfileCreateDto } from './profile-create.dto';

export class ProfileUpdateDto extends PartialType(ProfileCreateDto) {}
