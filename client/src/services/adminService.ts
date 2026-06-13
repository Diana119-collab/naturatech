import type { AdminStats, Destino } from '../types';
import { defaultDestinos } from './destinoService';

const ADMIN_TOKEN_KEY = 'naturatech_admin_token';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'naturatech2026';

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem(ADMIN_TOKEN_KEY, 'authenticated');
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(ADMIN_TOKEN_KEY) === 'authenticated';
}

export async function getAdminStats(): Promise<AdminStats> {
  const destinos = defaultDestinos;
  const allSpecies = destinos.flatMap((d) => d.especies);

  return {
    visitantes: 1284,
    especiesDescubiertas: 3420,
    destinosPopulares: destinos.map((d, i) => ({
      slug: d.slug,
      nombre: d.nombre.es,
      visitas: [856, 312, 116][i] ?? 50,
    })),
    especiesMasVistas: allSpecies.slice(0, 5).map((e, i) => ({
      id: e.id,
      nombre: e.nombre.es,
      vistas: [420, 380, 290, 210, 180][i] ?? 100,
    })),
  };
}

export async function updateDestino(destino: Destino): Promise<void> {
  const stored = localStorage.getItem('naturatech_admin_destinos');
  let destinos: Destino[] = stored ? JSON.parse(stored) : [...defaultDestinos];
  const idx = destinos.findIndex((d) => d.id === destino.id);
  if (idx >= 0) destinos[idx] = destino;
  else destinos.push(destino);
  localStorage.setItem('naturatech_admin_destinos', JSON.stringify(destinos));
}

export async function deleteDestino(id: string): Promise<void> {
  const stored = localStorage.getItem('naturatech_admin_destinos');
  let destinos: Destino[] = stored ? JSON.parse(stored) : [...defaultDestinos];
  destinos = destinos.filter((d) => d.id !== id);
  localStorage.setItem('naturatech_admin_destinos', JSON.stringify(destinos));
}
