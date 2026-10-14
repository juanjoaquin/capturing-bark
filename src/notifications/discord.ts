import { config } from "../../config.js";

export async function sendMessage(texto: string) {
    if (!config.discordWebhook) {
        console.warn("No se ha configurado el webhook de Discord");
        return;
    }

    try {
        const response = await fetch(config.discordWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: texto }),
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        console.log("Mensaje enviado a Discord correctamente");
    } catch (e) {
        console.error("Error al enviar el mensaje a Discord:", e);
    }
}