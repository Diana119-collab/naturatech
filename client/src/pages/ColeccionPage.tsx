import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDestinos } from '../services/destinoService';
import type { Destino, Especie } from '../types';
import { useProgress } from '../context/ProgressContext';
import { SpeciesCard } from '../components/SpeciesCard';
import { Modal } from '../components/ui/Modal';
import { SpeciesDetailCard } from '../components/SpeciesCard';
import { getTexto } from '../utils';
import { ExploradorBadge } from '../components/ExploradorBadge';

export function ColeccionPage() {
  const { t } = useTranslation('especies');
  const { i18n } = useTranslation();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [selected, setSelected] = useState<Especie | null>(null);
  const { isSpeciesDiscovered, progress } = useProgress();

  useEffect(() => {
    getDestinos().then(setDestinos);
  }, []);

  const allSpecies = destinos.flatMap((d) => d.especies);
  const discovered = allSpecies.filter((e) => isSpeciesDiscovered(e.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('progress', { found: discovered.length, total: allSpecies.length })}
          </p>
        </div>
        <ExploradorBadge />
      </div>

      <div className="w-full bg-emerald-100 rounded-full h-3">
        <div
          className="bg-emerald-600 h-3 rounded-full transition-all"
          style={{
            width: `${allSpecies.length ? (discovered.length / allSpecies.length) * 100 : 0}%`,
          }}
        />
      </div>

      {destinos.map((destino) => (
        <div key={destino.id}>
          <h2 className="font-bold text-emerald-800 mb-3">{getTexto(destino.nombre, i18n.language)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {destino.especies.map((especie) => (
              <SpeciesCard
                key={especie.id}
                especie={especie}
                discovered={isSpeciesDiscovered(especie.id)}
                onClick={() => isSpeciesDiscovered(especie.id) && setSelected(especie)}
              />
            ))}
          </div>
        </div>
      ))}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? getTexto(selected.nombre, i18n.language) : ''}
      >
        {selected && <SpeciesDetailCard especie={selected} />}
      </Modal>

      {progress && (
        <p className="text-center text-xs text-gray-400 font-mono">{progress.explorerId}</p>
      )}
    </div>
  );
}
