import { User } from "./user";
export interface Installation {
    id: number;
    name: string;
    intervals: string;
    performance_factors: string;
    price: number;
    type: string;
    creator: User;
}