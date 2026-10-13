import type { Request, Response } from "express";
import { episodeService } from "../services/episode.service.js";


export const episodeController = {
    async list(req: Request, res: Response) {
        res.json(await episodeService.listRecent(Number(req.query.limit)));
    },

    async listBarks(req: Request, res: Response) {
        res.json(await episodeService.listRecentBarks(Number(req.query.limit)));
    },

    async get(req: Request, res:Response){
        res.json(await episodeService.getWithBarks(String(req.params.id)));
    }
}