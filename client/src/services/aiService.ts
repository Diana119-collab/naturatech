import type { Destino, Especie, IdentificacionResult } from '../types';
import { delay } from '../utils';
import { classifyBirdImage } from './birdRecognition';

export async function identificarPorFoto(
  destino: Destino,
  especiesDescubiertas: string[],
  file?: File
): Promise<IdentificacionResult | null> {
  if (!file) return null;

  const recognition = await classifyBirdImage(file, destino, 'es');
  if (!recognition?.matchedEspecie) return null;

  if (especiesDescubiertas.includes(recognition.matchedEspecie.id)) {
    return null;
  }

  return {
    especie: recognition.matchedEspecie,
    confianza: recognition.topPrediction?.confidence ?? 0,
  };
}

export async function identificarPorSonido(
  destino: Destino,
  sonidoId: string
): Promise<IdentificacionResult> {
  await delay(1200);

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
