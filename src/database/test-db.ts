import pool from "./dbConnection.js";

async function main() {

    try {
        const [rows] = await pool.query("SELECT DATABASE() AS databaseName");
        console.log(rows);
    } finally {
        await pool.end();
    }
}

main().catch(console.error);