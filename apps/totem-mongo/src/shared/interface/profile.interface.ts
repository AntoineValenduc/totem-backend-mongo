import { Branch } from '../../schema/branch.schema';

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: string;
  zipcode: string;
  city: string;
  email: string;
  phoneNumber: string;
  branch: string | Branch;
}
