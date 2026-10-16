import { initDb } from "./database/db.js";
import { crearApi } from "./api/app.js";
import { iniciarMicrofono } from "./audio/microphone.js";
import { crearMonitor } from "./api/services/bark.service.js";
import { config } from "../config.js";

initDb().catch((e) => console.error("No se pudo conectar la base de datos", e));

const { detector } = crearMonitor();

const mic = iniciarMicrofono((volumen, bytes) => detector.procesar(volumen, bytes));
console.log("Escuchando ladridos... (Ctrl+C para salir)");

const server = crearApi().listen(config.port, () => {
    console.log(`API en el PUERTO: http://localhost:${config.port}`);
});