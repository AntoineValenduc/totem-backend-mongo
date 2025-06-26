/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BranchExposeDto } from './branche-expose.dto';
import { BadgeExposeDto } from './badge-expose.dto';
import { ProfileBadgeDto } from './profileBadge.dto';

export class ProfileExposeDto {
  @ApiProperty({ example: '60a6c4b5d3f1a2c5e8b7d4f1' })
    @Expose({ name: 'id' })
    @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
    readonly id: string;
  @ApiProperty({ example: '123456789' })
  @IsString()
  @Expose()
  readonly user_id: string;
  @ApiProperty({ example: 'Jean' })
  @IsString()
  @Expose()
  readonly first_name: string;
  @ApiProperty({ example: 'Dupont' })
  @IsString()
  @Expose()
  readonly last_name: string;
  @ApiProperty({ example: '1995-06-15', type: String, format: 'date-time' })
  @IsDate()
  @Expose()
  readonly date_of_birth: Date;
  @ApiProperty({ example: '12 rue de la paix' })
  @IsString()
  @Expose()
  readonly address: string;
  @ApiProperty({ example: '59211' })
  @IsString()
  @Expose()
  readonly zipcode: string;
  @ApiProperty({ example: 'Lille' })
  @IsString()
  @Expose()
  readonly city: string;
  @ApiProperty({ example: 'jean.dupont@email.com' })
  @IsEmail()
  @Expose()
  readonly email: string;
  @ApiProperty({ example: '+33605040302' })
  @IsString()
  @IsOptional()
  @Expose()
  readonly phone_number: string;
  @ApiPropertyOptional()
  @Expose()
  readonly is_deleted: boolean;
  @ApiProperty({
    example: '665f7dcd342b9c2d88c792b2',
    description: 'ID de la branche (ObjectId)',
  })
  @Type(() => BranchExposeDto)
  @IsOptional()
  @Expose()
  branch: BranchExposeDto;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BadgeExposeDto)
  @IsOptional()
  @Expose()
  badges: ProfileBadgeDto[];
}
