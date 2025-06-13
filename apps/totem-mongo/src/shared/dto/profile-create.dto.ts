import { ApiProperty } from '@nestjs/swagger';

export class ProfileCreateDto {
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
  readonly mail: string;
  @ApiProperty({ example: '+33605040302' })
  readonly phone_number: string;
  @ApiProperty({
    example: '665f7dcd342b9c2d88c792b2',
    description: 'ID de la branche (ObjectId)',
  })
  branch: string;
}
