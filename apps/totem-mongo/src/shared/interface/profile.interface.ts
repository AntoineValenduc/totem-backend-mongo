import {Branch} from "../../schema/branch.schema";

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    address: string;
    zipcode: string;
    city: string;
    mail: string;
    phoneNumber: string;
    branch: string | Branch;
}