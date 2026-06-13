import type { Destino, Especie, IdentificacionResult } from '../types';
import { delay } from '../utils';

export async function identificarPorFoto(
  destino: Destino,
  especiesDescubiertas: string[],
  _file?: File
): Promise<IdentificacionResult> {
  await delay(1500);

  const pendientes = destino.especies.filter((e) => !especiesDescubiertas.includes(e.id));
  const pool = pendientes.length > 0 ? pendientes : destino.especies;
  const especie = pool[Math.floor(Math.random() * pool.length)];

  return { especie, confianza: 0.85 + Math.random() * 0.12 };
}

export async function identificarPorSonido(
  destino: Destino,
  sonidoId: string
): Promise<IdentificacionResult> {
  await delay(1500);

  const especie =
    destino.especies.find((e) => e.sonido === sonidoId) ??
    destino.especies[0];

  return { especie, confianza: 0.92 };
}

export function getSonidosDisponibles(destino: Destino): { id: string; label: string; especieId: string }[] {
  return destino.especies
    .filter((e) => e.sonido)
    .map((e) => ({
      id: e.sonido!,
      label: e.nombre.es,
      especieId: e.id,
    }));
}

export function getEspecieById(destino: Destino, id: string): Especie | undefined {
  return destino.especies.find((e) => e.id === id);
}
