import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route that doesn't use the DB
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

let isInitialized = false;

async function bootstrap() {
    if (isInitialized) return;

    console.log("Initializing Express app for Vercel...");
    try {
        await registerRoutes(httpServer, app);

        // Global error handler
        app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
            const status = err.status || err.statusCode || 500;
            const message = err.message || "Internal Server Error";
            console.error("Vercel Runtime Error:", err);
            if (res.headersSent) return next(err);
            res.status(status).json({ message });
        });

        isInitialized = true;
        console.log("Initialization complete.");
    } catch (error) {
        console.error("Failed to initialize app:", error);
        throw error;
    }
}

export default async function handler(req: any, res: any) {
    try {
        await bootstrap();
        return app(req, res);
    } catch (error: any) {
        console.error("Handler Error:", error);
        res.status(500).json({
            error: "Initialization Failed",
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
}
