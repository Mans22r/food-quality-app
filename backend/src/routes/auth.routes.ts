import express from 'express';
import { z } from 'zod';
import * as authService from '../services/authService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

router.post('/register', async (req, res, next) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);
        const user = await authService.registerAdmin(email, password, name);
        // Remove sensitive data
        const { password: _, refreshTokenHash, ...userWithoutSecrets } = user;
        res.status(201).json({ message: 'Admin user created successfully', user: userWithoutSecrets });
    } catch (err: any) {
        if (err.message === 'Registration disabled. Contact administrator') {
            res.status(403).json({ error: err.message });
        } else {
            next(err); // Pass to global error handler
        }
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const result = await authService.login(email, password);

        // Set cookie for web
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json(result);
    } catch (err: any) {
        if (err.message === 'Invalid credentials') {
            res.status(401).json({ error: err.message });
        } else {
            next(err);
        }
    }
});

router.post('/refresh', async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;
        if (!token) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        const result = await authService.refresh(token);
        res.json(result);
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
});

router.post('/logout', authenticateToken, async (req, res, next) => {
    try {
        if (req.user) {
            await authService.logout(req.user.userId);
        }
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
});

export default router;
