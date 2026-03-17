import express from 'express';
import { registerRoutes } from '../server/routes';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// diagnostic route
app.get('/api/ping', (req, res) => {
    res.json({
        message: 'Bundled Ping Working',
        time: new Date().toISOString()
    });
});

// Initialization
console.log('Registering routes statically...');
registerRoutes(httpServer, app);

export default app;
