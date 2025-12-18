"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.registerAdmin = void 0;
const database_1 = require("../config/database");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const auditService_1 = require("./auditService");
const types_1 = require("../types");
const registerAdmin = async (email, password, name) => {
    const userCount = await database_1.prisma.user.count();
    if (userCount > 0) {
        throw new Error('Registration disabled. Contact administrator');
    }
    const hashedPassword = await (0, password_1.hashPassword)(password);
    const user = await database_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: types_1.Role.ADMIN,
        },
    });
    await (0, auditService_1.createAuditLog)(user.id, 'USER_CREATED', `user:${user.id}`, { role: 'ADMIN', method: 'register' });
    return user;
};
exports.registerAdmin = registerAdmin;
const login = async (email, password) => {
    const user = await database_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isValid = await (0, password_1.comparePassword)(password, user.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email, role: user.role });
    const tokenVersion = new Date().getTime(); // Simple versioning using timestamp or counter
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id, tokenVersion);
    // Store hashed refresh token (or the token itself if requirement says hash before storing)
    // Requirement: "Hashed before storing in database (bcrypt)" 
    // But standard JWT refresh token strategy usually validates the signature + expiry. 
    // If we hash it, we can't verify signature unless we store the raw token on client and send it.
    // Yes, standard is: client holds raw token. Server holds hash of it. 
    // usage: bcrypt.compare(rawRefreshToken, storedHash).
    const refreshTokenHash = await (0, password_1.hashPassword)(refreshToken);
    await database_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash },
    });
    await (0, auditService_1.createAuditLog)(user.id, 'LOGIN_SUCCESS');
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
exports.login = login;
const refresh = async (token) => {
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const user = await database_1.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user || !user.refreshTokenHash) {
            throw new Error('Invalid refresh token');
        }
        const isValid = await (0, password_1.comparePassword)(token, user.refreshTokenHash);
        if (!isValid) {
            throw new Error('Invalid refresh token');
        }
        const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email, role: user.role });
        return { accessToken };
    }
    catch (err) {
        throw new Error('Invalid refresh token');
    }
};
exports.refresh = refresh;
const logout = async (userId) => {
    await database_1.prisma.user.update({
        where: { id: userId },
        data: { refreshTokenHash: null },
    });
    await (0, auditService_1.createAuditLog)(userId, 'LOGOUT');
};
exports.logout = logout;
