import express from 'express';

const app = express();

app.get('/api/ping', (req, res) => {
    res.json({
        message: 'Pong!',
        time: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

export default app;
