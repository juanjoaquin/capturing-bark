export function horaArgentina(fecha: Date = new Date()): string {
    return fecha.toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}