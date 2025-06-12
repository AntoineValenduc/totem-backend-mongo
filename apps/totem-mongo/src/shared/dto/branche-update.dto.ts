import { PartialType } from '@nestjs/mapped-types';
import { BrancheCreateDto } from 'totem-mongo/src/shared/dto/branche-create.dto';

export class BrancheUpdateDto extends PartialType(BrancheCreateDto) {}
