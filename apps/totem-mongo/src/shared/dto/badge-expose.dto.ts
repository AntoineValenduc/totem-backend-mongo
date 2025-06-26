/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class BadgeExposeDto {
  @ApiProperty({ example: '60a6c4b5d3f1a2c5e8b7d4f1' })
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  readonly id: string;

  @ApiProperty({ example: 'Brouette' })
  @IsString()
  @Expose()
  readonly name: string;

  @ApiPropertyOptional({ example: 'Je décris mon badge' })
  @IsOptional()
  @IsString()
  @Expose()
  readonly description?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @Expose()
  readonly logo_url?: string;

  @ApiProperty({
    example: '665f7dcd342b9c2d88c792b2',
    description: 'ID de la branche (ObjectId)',
  })
  @IsMongoId()
  @Expose()
  readonly branch: string;
}
