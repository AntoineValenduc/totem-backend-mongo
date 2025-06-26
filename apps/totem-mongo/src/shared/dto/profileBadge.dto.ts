/* eslint-disable prettier/prettier */
import { IsDateString, IsMongoId, IsNumber, IsString, Max, Min } from 'class-validator';

export class ProfileBadgeDto {
    @IsMongoId()
    badge: string;

    @IsDateString()
    date_earned?: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    progress?: number;

    @IsString()
    status?: string;
}
