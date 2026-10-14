import { config } from "../../../config.js";
import { guardarEpisodio, guardarLadrido } from "../../database/db.js";
import { BarkDetector, type BarkEvent } from "../../detector.js";
import { EpisodeTracker, type Episode } from "../../episodes.js";
import { sendMessage } from "../../notifications/discord.js";
import { horaArgentina } from "../../utils/utils.js";

export function crearMonitor() {
    const detector = new BarkDetector();
    const episodios = new EpisodeTracker(config.silencioMs);

    detector.on("bark", (e: BarkEvent) => {
        console.log(    
            `🐶 ${horaArgentina(e.timestamp)} | ${e.durationMs} ms | ` +
            `max=${e.maxRms.toFixed(2)} | prom=${e.averageRms.toFixed(2)}`
        );
        const episodeId = episodios.registrar(e);
        guardarLadrido(e, episodeId);
    });

    episodios.on("start", (ep: Episode) => {
        console.log("➡️  Episodio iniciado");
        sendMessage(`🐶 Empezó a ladrar (${horaArgentina(ep.start)})`);
    });

    episodios.on("end", (ep: Episode) => {
        const seg = Math.round((ep.last.getTime() - ep.start.getTime()) / 1000);
        console.log(`⏹️  Episodio terminado: ${ep.count} ladridos en ${seg} s`);
        guardarEpisodio(ep);
        if (ep.count > 1) {
            sendMessage(`🐶 Actividad finalizada: ${ep.count} ladridos en ${seg} segundos.`);
        }
    });

    return { detector, episodios };
}