import "dotenv/config";
import mysql from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error("Faltan variables de entorno para conectar con MySQL.");
}

const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    timezone: "Z",            // fechas en UTC
    waitForConnections: true,
    connectionLimit: 5,
});

export default pool;