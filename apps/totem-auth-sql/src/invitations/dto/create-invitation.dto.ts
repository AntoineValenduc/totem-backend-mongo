import { Role } from '../../common/enums/role.enum';

export class CreateInvitationDto {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  branchId: string;
  address: string;
  zipcode: string;
  city: string;
  email: string;
  phone_number: string;
  email: string;
  role: Role;
}
