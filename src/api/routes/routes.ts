import { Router } from "express";
import { episodeController } from "../controllers/episode.controller.js";
import { statsController } from "../controllers/stats.controller.js";

const router = Router();

// EPISODES
router.get('/episodes', episodeController.list);
router.get('/episodes/:id', episodeController.get);
router.get('/barks', episodeController.listBarks);

// STATS
router.get('/stats/today', statsController.today);
router.get('/stats/by-hour', statsController.byHour);

export default router;