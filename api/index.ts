import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { seedDatabase } from "../server/seed";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(
    express.json({
        verify: (req: any, _res, buf) => {
            req.rawBody = buf;
        },
    }),
);
app.use(express.urlencoded({ extended: false }));

let isInitialized = false;

async function initializeApp() {
    if (isInitialized) return;
    await seedDatabase();
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("Internal Server Error:", err);
        if (res.headersSent) return next(err);
        return res.status(status).json({ message });
    });

    isInitialized = true;
}

export default async function handler(req: any, res: any) {
    await initializeApp();
    return app(req, res);
}
