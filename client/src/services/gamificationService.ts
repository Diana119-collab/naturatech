import type { Achievement } from '../types';

export const PUNTOS_ESPECIE = 10;
export const PUNTOS_ZONA = 50;
export const PUNTOS_DESTINO = 200;

export const ACHIEVEMENTS: Record<string, Achievement> = {
  primera_especie: {
    id: 'primera_especie',
    titulo: { es: '¡Primera especie!', en: 'First species!', pt: 'Primeira espécie!' },
    mensaje: { es: 'Has descubierto tu primera especie', en: 'You discovered your first species', pt: 'Você descobriu sua primeira espécie' },
  },
  zona_desbloqueada: {
    id: 'zona_desbloqueada',
    titulo: { es: '¡Nueva zona descubierta!', en: 'New zone discovered!', pt: 'Nova zona descoberta!' },
    mensaje: { es: 'Has desbloqueado una nueva zona', en: 'You unlocked a new zone', pt: 'Você desbloqueou uma nova zona' },
  },
  destino_completado: {
    id: 'destino_completado',
    titulo: { es: '¡Destino completado!', en: 'Destination completed!', pt: 'Destino completado!' },
    mensaje: { es: 'Has explorado todo el destino', en: 'You explored the entire destination', pt: 'Você explorou todo o destino' },
  },
};

export function getPuntosEspecie(): number {
  return PUNTOS_ESPECIE;
}

export function getPuntosZona(): number {
  return PUNTOS_ZONA;
}

export function getPuntosDestino(): number {
  return PUNTOS_DESTINO;
}

export function isZonaUnlocked(
  zonaId: string,
  especiesRequeridas: string[],
  especiesDescubiertas: string[],
  zonasDesbloqueadas: string[]
): boolean {
  if (zonasDesbloqueadas.includes(zonaId)) return true;
  return especiesRequeridas.every((id) => especiesDescubiertas.includes(id));
}

export function getZonasToUnlock(
  destinoZonas: { id: string; especiesRequeridas: string[] }[],
  especiesDescubiertas: string[],
  zonasDesbloqueadas: string[]
): string[] {
  return destinoZonas
    .filter(
      (z) =>
        !zonasDesbloqueadas.includes(z.id) &&
        z.especiesRequeridas.every((id) => especiesDescubiertas.includes(id))
    )
    .map((z) => z.id);
}

export function isDestinoCompleto(totalEspecies: number, descubiertas: number): boolean {
  return totalEspecies > 0 && descubiertas >= totalEspecies;
}
