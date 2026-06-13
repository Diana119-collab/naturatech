import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Lock, Unlock } from 'lucide-react';
import { useEffect } from 'react';
import type { Destino, Zona } from '../types';
import { getTexto } from '../utils';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

interface MapaDestinoProps {
  destino: Destino;
  isZoneUnlocked: (zonaId: string) => boolean;
  onZoneClick: (zona: Zona) => void;
  selectedZoneId?: string | null;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export function MapaDestino({
  destino,
  isZoneUnlocked,
  onZoneClick,
  selectedZoneId,
}: MapaDestinoProps) {
  const { i18n } = useTranslation();
  const { t } = useTranslation('explorar');
  const center: [number, number] = [destino.ubicacion.lat, destino.ubicacion.lng];

  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-md h-[320px] sm:h-[420px]">
      <MapContainer center={center} zoom={15} className="h-full w-full" scrollWheelZoom>
        <MapController center={center} zoom={15} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destino.zonas.map((zona) => {
          const unlocked = isZoneUnlocked(zona.id);
          const selected = selectedZoneId === zona.id;
          return (
            <CircleMarker
              key={zona.id}
              center={[zona.coords[0], zona.coords[1]]}
              radius={selected ? 18 : 14}
              pathOptions={{
                color: unlocked ? '#059669' : '#9ca3af',
                fillColor: unlocked ? '#10b981' : '#d1d5db',
                fillOpacity: unlocked ? 0.8 : 0.5,
                weight: selected ? 3 : 2,
                className: unlocked ? 'zone-unlocked' : 'zone-locked',
              }}
              eventHandlers={{
                click: () => onZoneClick(zona),
              }}
            >
              <Popup>
                <div className="text-center min-w-[120px]">
                  <span className="text-2xl">{zona.emoji}</span>
                  <p className="font-bold">{getTexto(zona.nombre, i18n.language)}</p>
                  <p className="text-xs flex items-center justify-center gap-1 mt-1">
                    {unlocked ? (
                      <>
                        <Unlock size={12} className="text-emerald-600" />
                        {t('unlocked')}
                      </>
                    ) : (
                      <>
                        <Lock size={12} className="text-gray-500" />
                        {t('locked')}
                      </>
                    )}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
