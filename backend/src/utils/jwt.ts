import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshSecret';

export const generateAccessToken = (payload: UserPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string, tokenVersion: number): string => {
    return jwt.sign({ userId, tokenVersion }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): UserPayload => {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
};

export const verifyRefreshToken = (token: string): { userId: string; tokenVersion: number } => {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string; tokenVersion: number };
};
