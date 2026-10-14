import "dotenv/config";

export const config = {
    discordWebhook: process.env.DISCORD_WEBHOOK,
    silencioMs: Number(process.env.SILENCIO_MS ?? 10_000),
    port: Number(process.env.PORT ?? 3000),
};