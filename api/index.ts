import express from 'express';
import { registerRoutes } from '../server/routes';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// diagnostic route
app.get('/api/ping', (req, res) => {
    res.json({ message: 'Integrated Pong!', time: new Date().toISOString() });
});

// Top-level await is supported in ESM on Vercel Node 18+
await registerRoutes(httpServer, app);

export default app;
