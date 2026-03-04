import express from 'express';
import { registerRoutes } from '../server/routes';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

app.use(express.json());

// Very simple route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Minimal express working' });
});

let initialized = false;

export default async function handler(req: any, res: any) {
    console.log('Handler invoked:', req.url);

    if (req.url === '/api/plain-test') {
        return res.status(200).json({ message: 'Plain Vercel function working' });
    }

    if (!initialized) {
        try {
            console.log('Registering routes...');
            await registerRoutes(httpServer, app);
            initialized = true;
            console.log('Routes registered');
        } catch (err: any) {
            console.error('Registration failed:', err);
            return res.status(500).json({ error: 'Registration Error', details: err.message });
        }
    }

    return app(req, res);
}
