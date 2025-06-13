import { Role } from '../../common/enums/role.enum';

export class CreateInvitationDto {
  email: string;
  role: Role;
}
