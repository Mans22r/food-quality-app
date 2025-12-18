import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.1.16:8081'],
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;

// Export app for testing/serverless, or start it
if (require.main === module) {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Minimal server running on port ${PORT}`);
    });
    
    server.on('error', (err) => {
        console.error('Server error:', err);
    });
    
    server.on('listening', () => {
        console.log('Server is now listening');
    });
}

export default app;