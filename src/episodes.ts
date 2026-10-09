import { EventEmitter } from 'events';
import type { BarkEvent } from './detector.js';

export interface Episode {
    start: Date;
    last: Date;
    count: number;
}

export class EpisodeTracker extends EventEmitter {
    private episode: Episode | null = null;
    private timer: NodeJS.Timeout | null = null;

    constructor(private silencioMs = 10_000) {
        super();
    }

    registrar(e: BarkEvent) {
        if (!this.episode) {
            this.episode = { start: e.timestamp, last: e.timestamp, count: 1 };
            this.emit('start', { ...this.episode });   // aquí va la notificación inmediata
        } else {
            this.episode.count++;
            this.episode.last = e.timestamp;           // se registra, pero no emite nada
        }

        // cada ladrido reinicia la cuenta: el silencio se mide desde el último
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.cerrar(), this.silencioMs);
    }

    private cerrar() {
        const ep = this.episode;
        this.episode = null;
        this.timer = null;
        if (ep) this.emit('end', ep);
    }
}