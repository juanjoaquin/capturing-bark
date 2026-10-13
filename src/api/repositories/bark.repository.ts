import type { RowDataPacket } from "mysql2";
import pool from "../../database/dbConnection.js";


export const barkRepository = {
    async findRecent(limit: number) {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT id, episode_id, barked_at, duration_ms, max_rms, average_rms
            FROM bark_events ORDER BY barked_at DESC LIMIT ?`,
            [limit]
        );
        return rows;
    },

    async findByEpisode(episodeId: string) {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT id, barked_at, duration_ms, max_rms, average_rms
            FROM barks_events WHERE episode_id = ? ORDER BY barked_at`,
            [episodeId]
        );
        return rows[0] ?? null
    },

    async summaryBetween(from: Date, to: Date) {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) AS barks,
                    COALESCE(MAX(duration_ms), 0) AS longest_bark_ms
            FROM bark_events
            WHERE barked_at >= ? AND barked_at < ?`,
            [from, to]
        );
        return rows[0];
    },

    async countByHour() {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT HOUR(CONVERT_TZ(barked_at, '+00:00', '-03:00')) AS hour,
                    COUNT(*) AS barks
            FROM bark_events GROUP BY hour`
        );
        return rows;
    },
}