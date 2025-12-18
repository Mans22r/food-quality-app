"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({
            error: 'Database operation failed',
            code: err.code,
        });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
        });
    }
    // Zod validation error or custom error handling can be added here
    res.status(500).json({
        error: 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
