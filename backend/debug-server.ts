import express from 'express';
import { prisma } from './src/config/database';

const app = express();

// Simple health check
app.get('/health', async (req, res) => {
    try {
        // Test database connection
        await prisma.$connect();
        res.status(200).json({ status: 'ok', db: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', db: 'disconnected', error: error.message });
    }
});

// Simple root endpoint
app.get('/', (req, res) => {
    res.send('Debug server running');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Debug server running on port ${PORT}`);
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});