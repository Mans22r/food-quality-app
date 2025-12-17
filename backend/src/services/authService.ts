import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { createAuditLog } from './auditService';
import { Role } from '../types';

export const registerAdmin = async (email: string, password: string, name: string) => {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
        throw new Error('Registration disabled. Contact administrator');
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: Role.ADMIN,
        },
    });

    await createAuditLog(user.id, 'USER_CREATED', `user:${user.id}`, { role: 'ADMIN', method: 'register' });
    return user;
};

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role as Role });
    const tokenVersion = new Date().getTime(); // Simple versioning using timestamp or counter
    const refreshToken = generateRefreshToken(user.id, tokenVersion);

    // Store hashed refresh token (or the token itself if requirement says hash before storing)
    // Requirement: "Hashed before storing in database (bcrypt)" 
    // But standard JWT refresh token strategy usually validates the signature + expiry. 
    // If we hash it, we can't verify signature unless we store the raw token on client and send it.
    // Yes, standard is: client holds raw token. Server holds hash of it. 
    // usage: bcrypt.compare(rawRefreshToken, storedHash).

    const refreshTokenHash = await hashPassword(refreshToken);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash },
    });

    await createAuditLog(user.id, 'LOGIN_SUCCESS');

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }
    };
};

export const refresh = async (token: string) => {
    try {
        const payload = verifyRefreshToken(token);
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });

        if (!user || !user.refreshTokenHash) {
            throw new Error('Invalid refresh token');
        }

        const isValid = await comparePassword(token, user.refreshTokenHash);
        if (!isValid) {
            throw new Error('Invalid refresh token');
        }

        const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role as Role });
        return { accessToken };
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
};

export const logout = async (userId: string) => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshTokenHash: null },
    });
    await createAuditLog(userId, 'LOGOUT');
};
