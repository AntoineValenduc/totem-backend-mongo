import { ApiProperty } from '@nestjs/swagger';

export class BadgeCreateDto {
  @ApiProperty({ example: 'Brouette' })
  readonly name: string;
  @ApiProperty({ example: 'Je décris mon badge' })
  readonly description: string;
  @ApiProperty({ example: '' })
  readonly logo_url: string;
  @ApiProperty({ example: '12' })
  readonly progress: number;
  @ApiProperty({ example: 'Obtenu' })
  readonly status: string;
  @ApiProperty({ example: '1995-06-15', type: String, format: 'date-time' })
  readonly dateEarned: Date;
  @ApiProperty({
    example: '665f7dcd342b9c2d88c792b2',
    description: 'ID de la branche (ObjectId)',
  })
  branch: string;
}
