import { Request } from 'express';

export enum Role {
    INSPECTOR = 'INSPECTOR',
    KITCHEN_MANAGER = 'KITCHEN_MANAGER',
    HOTEL_MANAGEMENT = 'HOTEL_MANAGEMENT',
    ADMIN = 'ADMIN'
}

export interface UserPayload {
    userId: string;
    email: string;
    role: Role;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
