import "dotenv/config";
import { randomUUID } from "node:crypto";
import pool from "./dbConnection.js";
import type { BarkEvent } from "../detector.js";

const SOURCE = process.env.SOURCE ?? "pc";

export async function initDb() {
    await pool.query("SELECT 1");
    console.log("Base de datos conectada");
};

export async function guardarLadrido(e: BarkEvent, episodeId: string) {
    try {

    } catch(error) {
        console.error("Error guardando ladrido", error);
    }
}

