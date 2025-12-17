const express = require('express');
const cors = require('cors');

const app = express();

// Simple CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Handle preflight requests for specific routes
app.options('/test', cors());
app.options('/health', cors());

// Simple route
app.get('/test', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});