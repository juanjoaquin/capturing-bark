import type { RowDataPacket } from "mysql2";
import pool from "../../database/dbConnection.js";

export const episodeRepisotry = {
    async findRecent(limit: number) {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT id, started_at, ended_at, bark_count FROM episodes ORDER BY started_at DESC LIMIT ?`,
            [limit]
        );
        return rows;
    },

    async findById(id: string) {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT id, started_at, ended_at, bark_count FROM episodes WHERE id = ?`, 
            [id]
        );
        return rows[0] ?? null;
    }
}