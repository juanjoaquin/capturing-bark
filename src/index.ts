import recorder from 'node-record-lpcm16';

const UMBRAL = 0.1;
const COOLDOWN_MS = 5000;
const CHUNKS_SEGUIDOS = 2;

let ultimaAlerta = 0;
let chunksSobreUmbral = 0;

function rms(buf: Buffer): number {
    const n = Math.floor(buf.length / 2);
    let suma = 0;
    for (let i = 0; i < n; i++) {
        const s = buf.readInt16LE(i * 2) / 32768;
        suma += s * s;
    }
    return Math.sqrt(suma / n);
}

function onLadrido(volumen: number) {

    const ahora = new Date();

    const horaArgentina = ahora.toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
      });

    console.log(`🐶 Ladrido detectado! volumen=${volumen.toFixed(3)} (${horaArgentina})`);
    // aquí luego irá: Discord, WebSocket y base de datos
}

const rec = recorder.record({
    sampleRate: 16000,
    channels: 1,
    audioType: 'raw',
    recorder: 'sox',
});

rec
    .stream()
    .on('error', (e: Error) => console.error('Error:', e))
    .on('data', (chunk: Buffer) => {
        const v = rms(chunk);

        if (v > UMBRAL) {
            chunksSobreUmbral++;
        } else {
            chunksSobreUmbral = 0;
        }

        const ahora = Date.now();
        if (chunksSobreUmbral >= CHUNKS_SEGUIDOS && ahora - ultimaAlerta > COOLDOWN_MS) {
            ultimaAlerta = ahora;
            chunksSobreUmbral = 0;
            onLadrido(v);
        }
    });


    console.log('Escuchando ladridos... (Ctrl+C para salir)');