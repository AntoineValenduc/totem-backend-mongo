import {Badge} from "./badge.interface";

export interface Branch {
    id: string
    name: string;
    color: string;
    description: string;
    range_age: string;
    badge: string | Badge[];
}