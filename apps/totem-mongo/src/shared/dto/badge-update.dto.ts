import { PartialType } from '@nestjs/mapped-types';
import { BadgeCreateDto } from './badge-create.dto';

export class BadgeUpdateDto extends PartialType(BadgeCreateDto) {}
