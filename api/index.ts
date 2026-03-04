import express from 'express';

const app = express();

app.get('/api/plain-test', (req, res) => {
    res.json({ message: 'Plain Vercel function working - NO IMPORTS' });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Express bridge working - NO IMPORTS' });
});

export default function handler(req: any, res: any) {
    console.log('Minimal Handler invoked:', req.url);
    return app(req, res);
}
