import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.json({ message: 'Standard Ping Working', time: new Date().toISOString() });
});

let initialized = false;

// We export the app directly
export default async (req: any, res: any) => {
    if (!initialized) {
        try {
            console.log('Lazy initializing routes...');
            // Use dynamic imports to catch errors during initialization
            const { registerRoutes } = await import('../server/routes');
            const { createServer } = await import('http');
            const httpServer = createServer(app);

            await registerRoutes(httpServer, app);
            initialized = true;
            console.log('Initialization success');
        } catch (err: any) {
            console.error('CRITICAL INITIALIZATION ERROR:', err);
            return res.status(500).json({
                error: 'Initialization Failed',
                message: err.message,
                stack: err.stack,
                context: 'Lazy initialization of routes'
            });
        }
    }

    return app(req, res);
};
