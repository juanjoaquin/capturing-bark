import { Router } from "express";
import { episodeController } from "../controllers/episode.controller.js";
import { statsController } from "../controllers/stats.controller.js";

const router = Router();

/*
curl http://localhost:3000/api/health
curl http://localhost:3000/api/episodes
curl "http://localhost:3000/api/episodes?limit=5"
curl http://localhost:3000/api/barks
curl http://localhost:3000/api/stats/today
curl http://localhost:3000/api/stats/by-hour
*/

// EPISODES
router.get('/episodes', episodeController.list);
router.get('/episodes/:id', episodeController.get);
router.get('/barks', episodeController.listBarks);

// STATS
router.get('/stats/today', statsController.today);
router.get('/stats/by-hour', statsController.byHour);

export default router;