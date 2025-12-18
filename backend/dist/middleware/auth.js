"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Auth middleware - Authorization header:', authHeader);
    console.log('Auth middleware - Token:', token);
    if (!token) {
        console.log('Auth middleware - No token provided');
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const user = (0, jwt_1.verifyAccessToken)(token);
        console.log('Auth middleware - User:', user);
        req.user = user;
        next();
    }
    catch (err) {
        console.log('Auth middleware - Invalid or expired token:', err);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log('Role middleware - User:', req.user);
        console.log('Role middleware - Allowed roles:', allowedRoles);
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            console.log('Role middleware - Access denied. User role:', req.user?.role, 'Allowed roles:', allowedRoles);
            return res.status(403).json({ error: 'Access denied' });
        }
        console.log('Role middleware - Access granted');
        next();
    };
};
exports.requireRole = requireRole;
