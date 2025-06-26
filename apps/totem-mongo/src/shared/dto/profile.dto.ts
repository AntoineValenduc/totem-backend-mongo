/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ProfileBadgeDto } from './profileBadge.dto';

export class ProfileCreateDto {
  @ApiProperty({ example: '123456789' })
  readonly user_id: string;
  @ApiProperty({ example: 'Jean' })
  readonly first_name: string;
  @ApiProperty({ example: 'Dupont' })
  readonly last_name: string;
  @ApiProperty({ example: '1995-06-15', type: String, format: 'date-time' })
  readonly date_of_birth: Date;
  @ApiProperty({ example: '12 rue de la paix' })
  readonly address: string;
  @ApiProperty({ example: '59211' })
  readonly zipcode: string;
  @ApiProperty({ example: 'Lille' })
  readonly city: string;
  @ApiProperty({ example: 'jean.dupont@email.com' })
  readonly email: string;
  @ApiProperty({ example: '+33605040302' })
  readonly phone_number: string;
  @ApiProperty({
    example: '665f7dcd342b9c2d88c792b2',
    description: 'ID de la branche (ObjectId)',
  })
  branch: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileBadgeDto)
  badges: ProfileBadgeDto[];
}
