import type { Destino, Especie, IdentificacionResult } from '../types';
import { delay } from '../utils';

function normalizarTexto(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function especiesAliases(especie: Especie): string[] {
  const aliases = [
    especie.id,
    especie.nombre.es,
    especie.nombre.en,
    especie.nombre.pt,
    ...Object.values(especie.nombre),
  ];

  return [...new Set(aliases.map(normalizarTexto).filter(Boolean))];
}

function scorePorNombre(fileName: string, especie: Especie): number {
  const nombre = normalizarTexto(fileName);
  if (!nombre) return 0;

  let score = 0;
  for (const alias of especiesAliases(especie)) {
    if (nombre.includes(alias)) score += 8;
    if (alias.includes(nombre)) score += 4;
  }

  const keywords: Record<string, string[]> = {
    'garza-azul': ['garza', 'heron', 'blue heron', 'wetland', 'lagoon'],
    'pelicano-peruano': ['pelican', 'pelicano', 'coast', 'beach'],
    cormoran: ['cormorant', 'cormoran', 'guano', 'rocky coast'],
    gaviota: ['gull', 'gaviota', 'beach', 'coast'],
    playerito: ['plover', 'playerito', 'shorebird', 'muddy', 'wetland'],
  };

  const speciesKeywords = keywords[especie.id] ?? [];
  for (const keyword of speciesKeywords) {
    if (nombre.includes(normalizarTexto(keyword))) score += 5;
  }

  return score;
}

function extractHueFromRgb(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) return 0;

  if (max === r) return ((g - b) / delta) % 6;
  if (max === g) return (b - r) / delta + 2;
  return (r - g) / delta + 4;
}

function getPaletteScore(especie: Especie, data: { r: number; g: number; b: number; brightness: number; saturation: number } | null): number {
  if (!data) return 0;

  const hue = extractHueFromRgb(data.r, data.g, data.b);
  const brightness = data.brightness;
  const saturation = data.saturation;

  const paletteMap: Record<string, { hueRange: [number, number]; brightnessRange: [number, number]; saturationRange: [number, number] }> = {
    'garza-azul': { hueRange: [120, 220], brightnessRange: [55, 85], saturationRange: [20, 80] },
    'pelicano-peruano': { hueRange: [180, 240], brightnessRange: [45, 80], saturationRange: [10, 55] },
    cormoran: { hueRange: [180, 220], brightnessRange: [20, 65], saturationRange: [10, 50] },
    gaviota: { hueRange: [180, 210], brightnessRange: [60, 95], saturationRange: [5, 40] },
    playerito: { hueRange: [25, 90], brightnessRange: [25, 75], saturationRange: [25, 80] },
  };

  const profile = paletteMap[especie.id] ?? paletteMap['garza-azul'];
  let score = 0;

  if (hue >= profile.hueRange[0] && hue <= profile.hueRange[1]) score += 8;
  if (brightness >= profile.brightnessRange[0] && brightness <= profile.brightnessRange[1]) score += 4;
  if (saturation >= profile.saturationRange[0] && saturation <= profile.saturationRange[1]) score += 3;

  return score;
}

async function analizarImagen(file: File): Promise<{ r: number; g: number; b: number; brightness: number; saturation: number } | null> {
  if (typeof document === 'undefined' || !file.type.startsWith('image/')) {
    return null;
  }

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
      reader.readAsDataURL(file);
    });

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('La imagen no es válida'));
      img.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    const width = 32;
    const height = 32;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);
    const data = context.getImageData(0, 0, width, height).data;

    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha === 0) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count += 1;
    }

    if (count === 0) return null;

    const avgR = r / count;
    const avgG = g / count;
    const avgB = b / count;
    const brightness = (avgR + avgG + avgB) / 3;
    const max = Math.max(avgR, avgG, avgB);
    const min = Math.min(avgR, avgG, avgB);
    const saturation = max === 0 ? 0 : ((max - min) / max) * 100;

    return { r: avgR, g: avgG, b: avgB, brightness, saturation };
  } catch {
    return null;
  }
}

export async function identificarPorFoto(
  destino: Destino,
  especiesDescubiertas: string[],
  file?: File
): Promise<IdentificacionResult> {
  await delay(1200);

  const disponibles = destino.especies.filter((e) => !especiesDescubiertas.includes(e.id));
  const opciones = disponibles.length > 0 ? disponibles : destino.especies;

  if (!file) {
    const especie = opciones[0] ?? destino.especies[0];
    return { especie, confianza: 0.81 };
  }

  const nombreArchivo = normalizarTexto(file.name ?? '');
  const pixelData = await analizarImagen(file);

  const conPuntaje = opciones
    .map((especie) => ({
      especie,
      score:
        scorePorNombre(nombreArchivo, especie) +
        getPaletteScore(especie, pixelData),
    }))
    .sort((a, b) => b.score - a.score);

  const mejor = conPuntaje[0]?.especie ?? opciones[0] ?? destino.especies[0];
  const confianza = Math.min(0.98, 0.82 + (conPuntaje[0]?.score ?? 0) * 0.02);

  return { especie: mejor, confianza };
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
