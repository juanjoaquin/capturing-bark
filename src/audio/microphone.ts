import recorder from "node-record-lpcm16";
import { rms } from "./rms.js";

export interface Microfono {
    stop(): void;
}

export function iniciarMicrofono(
    onChunk: (volumen: number, bytes: number) => void
): Microfono {
    const rec = recorder.record({
        sampleRate: 16000,
        channels: 1,
        audioType: "raw",
        recorder: "sox",
    });

    rec
        .stream()
        .on("error", (e: Error) => console.error("Error de micrófono:", e))
        .on("data", (chunk: Buffer) => onChunk(rms(chunk), chunk.length));

    return { stop: () => rec.stop() };
}