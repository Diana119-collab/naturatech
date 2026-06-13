export type Idioma = 'es' | 'en' | 'pt';

export interface TraduccionTexto {
  es: string;
  en: string;
  pt: string;
}

export interface Ubicacion {
  lat: number;
  lng: number;
}

export interface Zona {
  id: string;
  nombre: TraduccionTexto;
  emoji: string;
  coords: [number, number];
  especiesRequeridas: string[];
  orden: number;
}

export interface Especie {
  id: string;
  nombre: TraduccionTexto;
  imagen: string;
  silueta: string;
  sonido?: string;
  habitat: TraduccionTexto;
  alimentacion: TraduccionTexto;
  curiosidades: TraduccionTexto;
  importanciaEcologica: TraduccionTexto;
  zonaId: string;
}

export interface Destino {
  id: string;
  slug: string;
  nombre: TraduccionTexto;
  descripcion: TraduccionTexto;
  ubicacion: Ubicacion;
  imagen: string;
  ecosistema: TraduccionTexto;
  especialidad: TraduccionTexto;
  zonas: Zona[];
  especies: Especie[];
  preview?: boolean;
}

export interface ExploradorProgress {
  explorerId: string;
  destinoActivo: string | null;
  especiesDescubiertas: string[];
  zonasDesbloqueadas: string[];
  destinosCompletados: string[];
  puntos: number;
  nivel: number;
  fechaInicio: string;
}

export interface NivelInfo {
  nivel: number;
  titulo: TraduccionTexto;
  puntosMinimos: number;
}

export interface Achievement {
  id: string;
  titulo: TraduccionTexto;
  mensaje: TraduccionTexto;
}

export interface AdminStats {
  visitantes: number;
  especiesDescubiertas: number;
  destinosPopulares: { slug: string; nombre: string; visitas: number }[];
  especiesMasVistas: { id: string; nombre: string; vistas: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface IdentificacionResult {
  especie: Especie;
  confianza: number;
}
