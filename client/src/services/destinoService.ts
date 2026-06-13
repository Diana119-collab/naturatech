import type { Destino } from '../types';
import destinosData from '../data/destinos.json';

const destinos = destinosData as Destino[];

export async function getDestinos(): Promise<Destino[]> {
  const adminOverrides = getAdminDestinos();
  if (adminOverrides.length > 0) {
    return adminOverrides;
  }
  return Promise.resolve(destinos);
}

export async function getDestinoBySlug(slug: string): Promise<Destino | undefined> {
  const all = await getDestinos();
  return all.find((d) => d.slug === slug);
}

export async function getDestinoById(id: string): Promise<Destino | undefined> {
  const all = await getDestinos();
  return all.find((d) => d.id === id);
}

function getAdminDestinos(): Destino[] {
  try {
    const stored = localStorage.getItem('naturatech_admin_destinos');
    if (stored) return JSON.parse(stored) as Destino[];
  } catch {
    /* ignore */
  }
  return [];
}

export function saveAdminDestinos(data: Destino[]): void {
  localStorage.setItem('naturatech_admin_destinos', JSON.stringify(data));
}

export function resetAdminDestinos(): void {
  localStorage.removeItem('naturatech_admin_destinos');
}

export { destinos as defaultDestinos };
