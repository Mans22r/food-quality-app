const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Test server working' });
});

app.get('/', (req, res) => {
    res.send('Test server is running');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server is running on port ${PORT}`);
});