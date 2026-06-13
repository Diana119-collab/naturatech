import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { ExploradorProgress, Achievement } from '../types';
import { loadProgress, saveProgress, resetProgress, NIVELES } from '../services/progressService';
import {
  getPuntosEspecie,
  getPuntosZona,
  getPuntosDestino,
  getZonasToUnlock,
  isDestinoCompleto,
  ACHIEVEMENTS,
} from '../services/gamificationService';
import type { Destino } from '../types';
import { getTexto } from '../utils';
import { useTranslation } from 'react-i18next';

interface ProgressContextValue {
  progress: ExploradorProgress | null;
  loading: boolean;
  discoverSpecies: (destino: Destino, especieId: string) => Promise<Achievement[]>;
  setDestinoActivo: (slug: string | null) => Promise<void>;
  reset: () => Promise<void>;
  getNivelTitulo: () => string;
  isSpeciesDiscovered: (id: string) => boolean;
  isZoneUnlocked: (zonaId: string) => boolean;
  isDestinoCompleted: (destino: Destino) => boolean;
  getDiscoveredCount: (destino: Destino) => number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ExploradorProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    loadProgress().then((p) => {
      setProgress(p);
      setLoading(false);
    });
  }, []);

  const persist = useCallback(async (updated: ExploradorProgress) => {
    await saveProgress(updated);
    setProgress({ ...updated });
  }, []);

  const discoverSpecies = useCallback(
    async (destino: Destino, especieId: string): Promise<Achievement[]> => {
      if (!progress) return [];
      const achievements: Achievement[] = [];
      let updated = { ...progress };

      if (!updated.especiesDescubiertas.includes(especieId)) {
        updated.especiesDescubiertas = [...updated.especiesDescubiertas, especieId];
        updated.puntos += getPuntosEspecie();

        if (updated.especiesDescubiertas.length === 1) {
          achievements.push(ACHIEVEMENTS.primera_especie);
        }

        const newZones = getZonasToUnlock(
          destino.zonas,
          updated.especiesDescubiertas,
          updated.zonasDesbloqueadas
        );

        for (const zonaId of newZones) {
          updated.zonasDesbloqueadas = [...updated.zonasDesbloqueadas, zonaId];
          updated.puntos += getPuntosZona();
          achievements.push(ACHIEVEMENTS.zona_desbloqueada);
        }

        if (
          isDestinoCompleto(destino.especies.length, updated.especiesDescubiertas.filter((id) =>
            destino.especies.some((e) => e.id === id)
          ).length) &&
          !updated.destinosCompletados.includes(destino.id)
        ) {
          updated.destinosCompletados = [...updated.destinosCompletados, destino.id];
          updated.puntos += getPuntosDestino();
          achievements.push(ACHIEVEMENTS.destino_completado);
        }
      }

      await persist(updated);
      return achievements;
    },
    [progress, persist]
  );

  const setDestinoActivo = useCallback(
    async (slug: string | null) => {
      if (!progress) return;
      await persist({ ...progress, destinoActivo: slug });
    },
    [progress, persist]
  );

  const reset = useCallback(async () => {
    const p = await resetProgress();
    setProgress(p);
  }, []);

  const getNivelTitulo = useCallback(() => {
    if (!progress) return '';
    const nivel = NIVELES.find((n) => n.nivel === progress.nivel) ?? NIVELES[0];
    return getTexto(nivel.titulo, i18n.language);
  }, [progress, i18n.language]);

  const isSpeciesDiscovered = useCallback(
    (id: string) => progress?.especiesDescubiertas.includes(id) ?? false,
    [progress]
  );

  const isZoneUnlocked = useCallback(
    (zonaId: string) => progress?.zonasDesbloqueadas.includes(zonaId) ?? false,
    [progress]
  );

  const isDestinoCompleted = useCallback(
    (destino: Destino) => progress?.destinosCompletados.includes(destino.id) ?? false,
    [progress]
  );

  const getDiscoveredCount = useCallback(
    (destino: Destino) =>
      destino.especies.filter((e) => progress?.especiesDescubiertas.includes(e.id)).length,
    [progress]
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        discoverSpecies,
        setDestinoActivo,
        reset,
        getNivelTitulo,
        isSpeciesDiscovered,
        isZoneUnlocked,
        isDestinoCompleted,
        getDiscoveredCount,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
