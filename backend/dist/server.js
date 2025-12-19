"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorHandler_1 = require("./middleware/errorHandler");
const express_openid_connect_1 = require("express-openid-connect");
// Placeholder for routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const form_routes_1 = __importDefault(require("./routes/form.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const guideline_routes_1 = __importDefault(require("./routes/guideline.routes"));
const app = (0, express_1.default)();
// Enhanced CORS configuration - more flexible for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin)
            return callback(null, true);
        // Get allowed origins from environment variable or use defaults
        const allowedOrigins = process.env.CORS_ORIGIN?.split(',') ||
            ['http://localhost:3000', 'http://192.168.1.16:8081'];
        // Check if the origin is in our allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            // For production, be more permissive but log the attempt
            console.log('CORS request from origin:', origin);
            callback(null, true); // Temporarily allow all origins - tighten this in production
        }
    },
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
// Security middleware
app.use((0, helmet_1.default)());
// Rate limiting
// More lenient rate limiting for auth routes
app.use('/api/auth', (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // More reasonable limit for auth routes
    message: {
        error: 'Too many authentication requests, please try again later.'
    }
}));
// Standard rate limiting for other routes
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased limit for development
    message: {
        error: 'Too many requests, please try again later.'
    }
}));
// Body parsing
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Auth0 configuration - properly enabled now
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:5001',
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email'
    },
    routes: {
        callback: '/callback',
        login: '/login',
        logout: '/logout'
    }
};
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use((0, express_openid_connect_1.auth)(config));
// Custom route to check authentication status
app.get('/', (req, res) => {
    // Check if oidc exists before using it
    if (req.oidc) {
        res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    }
    else {
        res.send('Auth system not initialized');
    }
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/forms', form_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/stats', stats_routes_1.default);
app.use('/api/guidelines', guideline_routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
const PORT = parseInt(process.env.PORT || '5001', 10);
// Export app for testing/serverless, or start it
if (require.main === module) {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
    server.on('error', (err) => {
        console.error('Server error:', err);
    });
    server.on('listening', () => {
        console.log('Server is now listening');
    });
}
exports.default = app;
