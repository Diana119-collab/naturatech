import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDestinoBySlug } from '../services/destinoService';
import type { Destino, Zona, Especie } from '../types';
import { getTexto } from '../utils';
import { useProgress } from '../context/ProgressContext';
import { useToast } from '../context/ToastContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { MapaDestino } from '../components/MapaDestino';
import { ZoneCard } from '../components/ZoneCard';
import { IdentificadorEspecie } from '../components/IdentificadorEspecie';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { ExploradorBadge } from '../components/ExploradorBadge';
import { isZonaUnlocked as checkZonaUnlocked } from '../services/gamificationService';

export function ExplorarPage() {
  const { destino: slug } = useParams<{ destino: string }>();
  const { t } = useTranslation('explorar');
  const { i18n } = useTranslation();
  const [destino, setDestino] = useState<Destino | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zona | null>(null);
  const [showIdentify, setShowIdentify] = useState(false);
  const {
    progress,
    isZoneUnlocked,
    isSpeciesDiscovered,
    discoverSpecies,
    setDestinoActivo,
  } = useProgress();
  const { showAchievement } = useToast();
  const { speak } = useAccessibility();

  useEffect(() => {
    if (slug) {
      getDestinoBySlug(slug).then((d) => setDestino(d ?? null));
      setDestinoActivo(slug);
    }
  }, [slug, setDestinoActivo]);

  if (!destino) {
    return <div className="text-center py-12 text-emerald-600">Cargando...</div>;
  }

  const handleZoneClick = (zona: Zona) => {
    setSelectedZone(zona);
    setShowIdentify(true);
  };

  const handleConfirmSpecies = async (especie: Especie) => {
    const achievements = await discoverSpecies(destino, especie.id);
    achievements.forEach(showAchievement);
    speak(getTexto(especie.nombre, i18n.language), i18n.language);
    setShowIdentify(false);
    setSelectedZone(null);
  };

  const zoneUnlocked = (zona: Zona) =>
    checkZonaUnlocked(
      zona.id,
      zona.especiesRequeridas,
      progress?.especiesDescubiertas ?? [],
      progress?.zonasDesbloqueadas ?? []
    ) || isZoneUnlocked(zona.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/destinos" className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-700">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-900">
            {getTexto(destino.nombre, i18n.language)}
          </h1>
          <p className="text-sm text-gray-600">{getTexto(destino.ecosistema, i18n.language)}</p>
        </div>
        <ExploradorBadge compact />
      </div>

      <MapaDestino
        destino={destino}
        isZoneUnlocked={(id) => {
          const z = destino.zonas.find((z) => z.id === id);
          return z ? zoneUnlocked(z) : false;
        }}
        onZoneClick={handleZoneClick}
        selectedZoneId={selectedZone?.id}
      />

      <div>
        <h2 className="font-bold text-emerald-900 mb-3">{t('zones')}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {destino.zonas
            .sort((a, b) => a.orden - b.orden)
            .map((zona) => (
              <ZoneCard
                key={zona.id}
                zona={zona}
                unlocked={zoneUnlocked(zona)}
                selected={selectedZone?.id === zona.id}
                onClick={() => handleZoneClick(zona)}
              />
            ))}
        </div>
      </div>

      <Modal
        open={showIdentify && !!selectedZone}
        onClose={() => setShowIdentify(false)}
        title={
          selectedZone
            ? `${selectedZone.emoji} ${getTexto(selectedZone.nombre, i18n.language)}`
            : t('identify')
        }
      >
        {selectedZone && (
          <>
            <p className="text-sm text-gray-600 mb-4">{t('speciesInZone')}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {destino.especies
                .filter((e) => e.zonaId === selectedZone.id)
                .map((e) => (
                  <span
                    key={e.id}
                    className={`text-xs px-2 py-1 rounded-full ${
                      isSpeciesDiscovered(e.id)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {isSpeciesDiscovered(e.id)
                      ? getTexto(e.nombre, i18n.language)
                      : '???'}
                  </span>
                ))}
            </div>
            <IdentificadorEspecie
              destino={destino}
              especiesDescubiertas={progress?.especiesDescubiertas ?? []}
              onConfirm={handleConfirmSpecies}
            />
          </>
        )}
      </Modal>

      {!selectedZone && (
        <p className="text-center text-gray-500 text-sm">{t('selectZone')}</p>
      )}

      <div className="text-center">
        <Button variant="secondary" onClick={() => { setSelectedZone(destino.zonas[0]); setShowIdentify(true); }}>
          {t('identify')}
        </Button>
      </div>
    </div>
  );
}
