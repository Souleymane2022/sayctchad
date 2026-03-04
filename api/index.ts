import express from 'express';
import { storage } from '../server/storage';
import { registerRoutes } from '../server/routes';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

app.use(express.json());

app.get('/api/test-storage', async (req, res) => {
    try {
        const partners = await storage.getAllPartners();
        res.json({ message: 'Storage working (HTTP)', partnersCount: partners.length });
    } catch (err: any) {
        res.status(500).json({ error: 'Storage failure', details: err.message });
    }
});

let initialized = false;

export default async function handler(req: any, res: any) {
    if (!initialized) {
        try {
            await registerRoutes(httpServer, app);
            initialized = true;
        } catch (err: any) {
            return res.status(500).json({ error: 'Registration Error', details: err.message });
        }
    }
    return app(req, res);
}
