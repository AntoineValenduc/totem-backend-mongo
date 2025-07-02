import { ProfileCreateDto } from '../../../../totem-mongo/src/shared/dto/profile-create.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterNewUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  //@IsString()
  @IsNotEmpty()
  profile: ProfileCreateDto;
}
