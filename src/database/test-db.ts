import connect from "./dbConnection.js";

async function main() {
    const connection = await connect();

    try {
        const [rows] = await connection.query("SELECT DATABASE() AS databaseName");
        console.log(rows);
    } finally {
        await connection.end();
    }
}

main().catch(console.error);