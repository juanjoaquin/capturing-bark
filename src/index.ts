import "dotenv/config";
import recorder from 'node-record-lpcm16';
import { BarkDetector, type BarkEvent } from "./detector.js";
import { EpisodeTracker, type Episode } from './episodes.js';

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const SILENCIO_MS = Number(process.env.SILENCIO_MS ?? 10_000);

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

// Ahora recibe un texto, no un BarkEvent
async function sendMessage(texto: string) {
    if (!DISCORD_WEBHOOK) {
        console.warn('No se ha configurado el webhook de Discord');
        return;
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: texto }),
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
const episodios = new EpisodeTracker(SILENCIO_MS);

// Cada ladrido: se muestra en consola y se registra en el episodio.
// Ya NO se manda un mensaje por cada ladrido.
detector.on('bark', (e: BarkEvent) => {
    console.log(
        `🐶 ${horaArgentina(e.timestamp)} | ${e.durationMs} ms | ` +
        `max=${e.maxRms.toFixed(2)} | prom=${e.averageRms.toFixed(2)}`
    );
    // guardarLadrido(e);  // más adelante: cada ladrido se guarda siempre
    episodios.registrar(e);
});

// Primer ladrido del episodio: notificación inmediata
episodios.on('start', (ep: Episode) => {
    console.log('➡️  Episodio iniciado');
    sendMessage(`🐶 Empezó a ladrar (${horaArgentina(ep.start)})`);
});

// Pasaron SILENCIO_MS sin ladridos: el episodio terminó
episodios.on('end', (ep: Episode) => {
    const seg = Math.round((ep.last.getTime() - ep.start.getTime()) / 1000);
    console.log(`⏹️  Episodio terminado: ${ep.count} ladridos en ${seg} s`);
    if (ep.count > 1) {   // si fue un solo ladrido, no hace falta resumen
        sendMessage(`🐶 Actividad finalizada: ${ep.count} ladridos en ${seg} segundos.`);
    }
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