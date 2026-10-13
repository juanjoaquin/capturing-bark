import { NotFoundError } from "../errors.js";
import { barkRepository } from "../repositories/bark.repository.js";
import { episodeRepisotry } from "../repositories/episode.repository.js";


function limitar(value: number, perDefect: number, max: number) {
    if(!Number.isFinite(value) || value < 1) return perDefect;
    return Math.min(Math.floor(value), max);
}

export const episodeService = {
    listRecent(limit: number) {
        return episodeRepisotry.findRecent(limitar(limit, 20, 100));
    },

    listRecentBarks(limit: number) {
        return barkRepository.findRecent(limitar(limit, 50, 100));
    },

    async getWithBarks(id: string) {
        const episode = await episodeRepisotry.findById(id);
        if(!episode) throw new NotFoundError('Episodio no encontrado');
        const barks = await barkRepository.findByEpisode(id);
        return {...episode, barks};
    }
};