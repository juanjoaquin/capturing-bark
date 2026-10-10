
import "dotenv/config";
import mysql from "mysql2/promise";

async function connect() {
    const {
        DB_HOST,
        DB_PORT,
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
    } = process.env;

    // Validamos que las variables obligatorias existan.
    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
        throw new Error(
            "Faltan variables de entorno para conectar con MySQL."
        );
    }

    try {
        const connection = await mysql.createPool({
            host: DB_HOST,
            port: Number(DB_PORT ?? 3306),
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
        });

        console.log("Connection to MySQL established.");

        return connection;
    } catch (error) {
        console.error("Error connecting to MySQL:", error);
        throw error;
    }
}

export default connect;