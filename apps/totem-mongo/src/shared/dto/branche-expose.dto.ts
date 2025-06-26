/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BadgeExposeDto } from './badge-expose.dto';

export class BranchExposeDto {
  @ApiProperty({ example: '60a6c4b5d3f1a2c5e8b7d4f1' })
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  readonly id: string;
  @ApiProperty({ example: 'Pionnier' })
  @IsString()
  @Expose()
  readonly name: string;
  @ApiProperty({ example: 'Rouge' })
  @IsString()
  @Expose()
  readonly color: string;
  @ApiProperty({ example: 'Je décris ma branche' })
  @IsString()
  @Expose()
  readonly description: string;
  @ApiProperty({ example: '15-17' })
  @IsString()
  @Expose()
  readonly range_age: string;
  @ApiPropertyOptional({ type: [BadgeExposeDto] })
  @IsOptional()
  @Expose()
  @Type(() => BadgeExposeDto)
  readonly badges?: BadgeExposeDto[];
}
