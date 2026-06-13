import type { ExploradorProgress, NivelInfo } from '../types';

const STORAGE_KEY = 'naturatech_progress';

export const NIVELES: NivelInfo[] = [
  {
    nivel: 1,
    titulo: { es: 'Explorador', en: 'Explorer', pt: 'Explorador' },
    puntosMinimos: 0,
  },
  {
    nivel: 2,
    titulo: { es: 'Observador de aves', en: 'Bird watcher', pt: 'Observador de aves' },
    puntosMinimos: 50,
  },
  {
    nivel: 3,
    titulo: { es: 'Guardián de la naturaleza', en: 'Nature guardian', pt: 'Guardião da natureza' },
    puntosMinimos: 150,
  },
];

export function generateExplorerId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `NT-${num}`;
}

export function calcularNivel(puntos: number): number {
  let nivel = 1;
  for (const n of NIVELES) {
    if (puntos >= n.puntosMinimos) nivel = n.nivel;
  }
  return nivel;
}

export function getDefaultProgress(explorerId: string): ExploradorProgress {
  return {
    explorerId,
    destinoActivo: null,
    especiesDescubiertas: [],
    zonasDesbloqueadas: [],
    destinosCompletados: [],
    puntos: 0,
    nivel: 1,
    fechaInicio: new Date().toISOString(),
  };
}

export async function loadProgress(): Promise<ExploradorProgress> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ExploradorProgress;
      parsed.nivel = calcularNivel(parsed.puntos);
      return parsed;
    }
  } catch {
    /* ignore */
  }

  const id = generateExplorerId();
  const progress = getDefaultProgress(id);
  await saveProgress(progress);
  return progress;
}

export async function saveProgress(progress: ExploradorProgress): Promise<void> {
  progress.nivel = calcularNivel(progress.puntos);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return Promise.resolve();
}

export async function resetProgress(): Promise<ExploradorProgress> {
  localStorage.removeItem(STORAGE_KEY);
  return loadProgress();
}
