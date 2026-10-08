import { EventEmitter } from 'events';

export interface BarkEvent {
    timestamp: Date;
    durationMs: number;
    maxRms: number;
    averageRms: number;
}

const SAMPLE_RATE = 16000;
const UMBRAL_INICIO = 0.1;
const UMBRAL_FIN = 0.06;
const SILENCIO_PARA_CERRAR_MS = 150;
const DURACION_MINIMA_MS = 60; // descarta golpes muy cortos

export class BarkDetector extends EventEmitter {
    private sonando = false;
    private inicio = new Date();
    private duracionMs = 0;
    private silencioMs = 0;
    private maxRms = 0;
    private sumaRms = 0;
    private chunks = 0;

    procesar(rms: number, chunkBytes: number) {
        const chunkMs = (chunkBytes / 2 / SAMPLE_RATE) * 1000;

        if (!this.sonando) {
            if (rms > UMBRAL_INICIO) {
                this.sonando = true;
                this.inicio = new Date();
                this.duracionMs = chunkMs;
                this.silencioMs = 0;
                this.maxRms = rms;
                this.sumaRms = rms;
                this.chunks = 1;
            }
            return;
        }

        this.duracionMs += chunkMs;
        this.maxRms = Math.max(this.maxRms, rms);
        this.sumaRms += rms;
        this.chunks++;

        this.silencioMs = rms < UMBRAL_FIN ? this.silencioMs + chunkMs : 0;

        if (this.silencioMs >= SILENCIO_PARA_CERRAR_MS) {
            this.sonando = false;
            const duracionReal = this.duracionMs - this.silencioMs;
            if (duracionReal >= DURACION_MINIMA_MS) {
                this.emit('bark', {
                    timestamp: this.inicio,
                    durationMs: Math.round(duracionReal),
                    maxRms: this.maxRms,
                    averageRms: this.sumaRms / this.chunks,
                } satisfies BarkEvent);
            }
        }
    }
}