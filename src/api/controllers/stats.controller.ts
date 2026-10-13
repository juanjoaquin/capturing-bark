import type { Request, Response } from "express";
import { statsService } from "../services/stats.service.js";

export const statsController = {
    async today(_req: Request, res: Response) {
        res.json(await statsService.today());
    },

    async byHour(_req: Request, res: Response) {
        res.json(await statsService.byHour());
    }
}