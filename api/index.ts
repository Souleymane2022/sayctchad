import express from 'express';
import { storage } from '../server/storage';

const app = express();

app.get('/api/test-storage', async (req, res) => {
    try {
        const partners = await storage.getAllPartners();
        res.json({ message: 'Storage working', partnersCount: partners.length });
    } catch (err: any) {
        res.status(500).json({ error: 'Storage failure', details: err.message });
    }
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Express bridge working' });
});

export default function handler(req: any, res: any) {
    return app(req, res);
}
