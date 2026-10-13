import { barkRepository } from "../repositories/bark.repository.js";

const AR_OFFSET_MS = 3 * 60 * 60 * 1000; // Argentina = UTC-3, sin horario de verano

// inicio y fin del día actual en Argentina, expresados en UTC
function rangoDeHoy() {
    const ahoraAR = new Date(Date.now() - AR_OFFSET_MS);
    const inicioUtc = Date.UTC(
        ahoraAR.getUTCFullYear(),
        ahoraAR.getUTCMonth(),
        ahoraAR.getUTCDate()
    ) + AR_OFFSET_MS;
    return { from: new Date(inicioUtc), to: new Date(inicioUtc + 24 * 60 * 60 * 1000) };
}

export const statsService = {
    async today() {
        const { from, to } = rangoDeHoy();
        return barkRepository.summaryBetween(from, to);
    },

    // siempre devuelve las 24 horas, con 0 donde no hubo ladridos
    async byHour() {
        const rows = await barkRepository.countByHour();
        const porHora = new Map(rows.map((r) => [Number(r.hour), Number(r.barks)]));
        return Array.from({ length: 24 }, (_, hour) => ({
            hour,
            barks: porHora.get(hour) ?? 0,
        }));
    },
};