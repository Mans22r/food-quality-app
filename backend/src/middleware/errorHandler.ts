import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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
