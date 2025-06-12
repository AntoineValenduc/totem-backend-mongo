import { PartialType } from '@nestjs/mapped-types';
import { BadgeCreateDto } from 'totem-mongo/src/shared/dto/badge-create.dto';

export class BadgeUpdateDto extends PartialType(BadgeCreateDto) {}
