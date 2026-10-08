import "dotenv/config";
import recorder from 'node-record-lpcm16';
import { BarkDetector, type BarkEvent } from "./detector.js";

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

function rms(buf: Buffer): number {
    const n = Math.floor(buf.length / 2);
    let suma = 0;
    for (let i = 0; i < n; i++) {
        const s = buf.readInt16LE(i * 2) / 32768;
        suma += s * s;
    }
    return Math.sqrt(suma / n);
}

function horaArgentina(fecha: Date = new Date()): string {
    return fecha.toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

async function sendMessage(event: BarkEvent) {
    if (!DISCORD_WEBHOOK) {
        console.warn('No se ha configurado el webhook de Discord');
        return;
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content:
                    `🐶 Ladrido detectado (${horaArgentina(event.timestamp)})\n` +
                    `Duración: ${event.durationMs} ms | ` +
                    `Máx: ${event.maxRms.toFixed(2)} | ` +
                    `Prom: ${event.averageRms.toFixed(2)}`,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        console.log('Mensaje enviado a Discord correctamente');
    } catch (e) {
        console.error('Error al enviar el mensaje a Discord:', e);
    }
}

const detector = new BarkDetector();

detector.on('bark', (e: BarkEvent) => {
    console.log(
        `🐶 ${horaArgentina(e.timestamp)} | ${e.durationMs} ms | ` +
        `max=${e.maxRms.toFixed(2)} | prom=${e.averageRms.toFixed(2)}`
    );
    sendMessage(e);   // actívalo cuando termines de calibrar
});

const rec = recorder.record({
    sampleRate: 16000,
    channels: 1,
    audioType: 'raw',
    recorder: 'sox',
});

rec
    .stream()
    .on('error', (e: Error) => console.error('Error:', e))
    .on('data', (chunk: Buffer) => detector.procesar(rms(chunk), chunk.length));

console.log('Escuchando ladridos... (Ctrl+C para salir)');