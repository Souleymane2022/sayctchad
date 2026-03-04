import express from 'express';

export default async function handler(req: any, res: any) {
    try {
        const app = express();
        app.use(express.json());

        app.get('/api/diagnostic', (req, res) => {
            res.json({
                status: 'ok',
                env: {
                    NODE_ENV: process.env.NODE_ENV,
                    VERCEL: process.env.VERCEL
                }
            });
        });

        // Try to import our modules inside the handler to catch errors
        try {
            const { storage } = await import('../server/storage');
            const { registerRoutes } = await import('../server/routes');
            const { createServer } = await import('http');

            const server = createServer(app);
            await registerRoutes(server, app);

            console.log('Routes and storage loaded successfully');
        } catch (importError: any) {
            console.error('Project module import failed:', importError);
            // Even if project modules fail, our diagnostic route above might have been hit 
            // if Vercel routes correctly, but since we are using app(req, res) at the end,
            // let's just return the error here.
            return res.status(500).json({
                error: 'Import Error',
                message: importError.message,
                stack: importError.stack
            });
        }

        return app(req, res);
    } catch (globalError: any) {
        return res.status(500).json({
            error: 'Global Handler Error',
            message: globalError.message,
            stack: globalError.stack
        });
    }
}
