import { PartialType } from '@nestjs/mapped-types';
import { BrancheCreateDto } from './branche-create.dto';

export class BrancheUpdateDto extends PartialType(BrancheCreateDto) {}
