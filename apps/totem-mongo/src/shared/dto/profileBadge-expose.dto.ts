import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDateString, IsMongoId, IsNumber, IsString, Max, Min } from 'class-validator';

export class ProfileBadgeExposeDto {
    @ApiProperty({ example: '60a6c4b5d3f1a2c5e8b7d4f1' })
    @Expose({ name: 'id' })
    @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
    readonly id: string;
    
    @IsMongoId()
    @Expose()
    badge: string;

    @IsDateString()
    @Expose()
    date_earned?: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    @Expose()
    progress?: number;

    @IsString()
    @Expose()
    status?: string;
}
