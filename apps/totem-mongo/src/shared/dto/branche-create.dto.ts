import { ApiProperty } from '@nestjs/swagger';

export class BrancheCreateDto {
  @ApiProperty({ example: 'Tatami' })
  readonly name: string;
  @ApiProperty({ example: 'Rouge' })
  readonly color: string;
  @ApiProperty({ example: 'Je décris ma branche' })
  readonly description: string;
  @ApiProperty({ example: '11-15' })
  readonly range_age: string;
}
