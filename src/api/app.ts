import express from "express";
import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "./errors.js";
import routes from './routes/routes.js'


export function crearApi() {
    const app = express();

    app.get("/api/health", (_req, res) => {
        res.json({ok: true});
    });

    app.use("/api", routes);

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof NotFoundError) {
            return res.status(404).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: "Error interno" });
    });

    return app;
}