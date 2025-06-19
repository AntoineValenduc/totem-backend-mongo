import { Role } from '../../common/enums/role.enum';

export class CreateFullInvitationDto {
  email: string;
  role: Role.JEUNE;
  profile: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    address: string;
    zipcode: string;
    city: string;
    email: string;
    phone_number: string;
    photo_url?: string;
    branch: string;
  };
}