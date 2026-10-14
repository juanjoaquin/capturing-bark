export function rms(buf: Buffer): number {
    const n = Math.floor(buf.length / 2);
    let suma = 0;
    for (let i = 0; i < n; i++) {
        const s = buf.readInt16LE(i * 2) / 32768;
        suma += s * s;
    }
    return Math.sqrt(suma / n);
}