"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const authService = __importStar(require("../services/authService"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(1),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);
        const user = await authService.registerAdmin(email, password, name);
        // Remove sensitive data
        const { password: _, refreshTokenHash, ...userWithoutSecrets } = user;
        res.status(201).json({ message: 'Admin user created successfully', user: userWithoutSecrets });
    }
    catch (err) {
        if (err.message === 'Registration disabled. Contact administrator') {
            res.status(403).json({ error: err.message });
        }
        else {
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
    }
    catch (err) {
        if (err.message === 'Invalid credentials') {
            res.status(401).json({ error: err.message });
        }
        else {
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
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
});
router.post('/logout', auth_1.authenticateToken, async (req, res, next) => {
    try {
        if (req.user) {
            await authService.logout(req.user.userId);
        }
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
