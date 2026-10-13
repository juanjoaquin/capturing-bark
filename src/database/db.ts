import "dotenv/config";
import { randomUUID } from "node:crypto";
import pool from "./dbConnection.js";
import type { BarkEvent } from "../detector.js";
import type { Episode } from "../episodes.js";

const SOURCE = process.env.SOURCE ?? "pc";

export async function initDb() {
    await pool.query("SELECT 1");
    console.log("Base de datos conectada");
};

export async function guardarLadrido(e: BarkEvent, episodeId: string) {
    try {
        await pool.execute(
            `INSERT INTO bark_events
             (id, episode_id, barked_at, duration_ms, max_rms, average_rms, source)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [randomUUID(), episodeId, e.timestamp, e.durationMs, e.maxRms, e.averageRms, SOURCE]
        );
    } catch (error) {
        console.error("Error guardando ladrido", error);
    }
}

export async function guardarEpisodio(ep: Episode) {
    try {
        await pool.execute('INSERT INTO episodes (id, started_at, ended_at, bark_count) VALUES (?, ?, ?, ?)',
            [ep.id, ep.start, ep.last, ep.count]
        )
    } catch (error) {
        console.error("Error guardando episodio", error)
    }
}