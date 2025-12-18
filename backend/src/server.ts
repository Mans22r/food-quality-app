import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { auth } from 'express-openid-connect';

// Placeholder for routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import formRoutes from './routes/form.routes';
import reportRoutes from './routes/report.routes';
import statsRoutes from './routes/stats.routes';
import guidelineRoutes from './routes/guideline.routes';

const app = express();

// CORS configuration - must be the very first middleware
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://192.168.1.16:8081'],
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Security middleware
app.use(helmet());

// Rate limiting
// More lenient rate limiting for auth routes
app.use('/api/auth', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // More reasonable limit for auth routes
    message: {
        error: 'Too many authentication requests, please try again later.'
    }
}));

// Standard rate limiting for other routes
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased limit for development
    message: {
        error: 'Too many requests, please try again later.'
    }
}));

// Body parsing
app.use(express.json());
app.use(cookieParser());

// Removed duplicate CORS configuration - handled by cors middleware above

// Auth0 configuration (temporarily disabled for CORS testing)
// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: process.env.AUTH0_SECRET,
//   baseURL: 'http://localhost:5000', // Backend URL
//   clientID: process.env.AUTH0_CLIENT_ID,
//   clientSecret: process.env.AUTH0_CLIENT_SECRET,
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//   authorizationParams: {
//     response_type: 'code',
//     scope: 'openid profile email'
//   },
//   routes: {
//     callback: '/callback',
//     login: '/login',
//     logout: '/logout'
//   }
// };

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// Custom route to check authentication status
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/guidelines', guidelineRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

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

export default app;
