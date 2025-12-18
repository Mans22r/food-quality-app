"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = void 0;
const requireRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
exports.requireRoles = requireRoles;
