import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { getDestinos } from '../services/destinoService';
import type { Destino } from '../types';
import { getTexto } from '../utils';
import { useAccessibility } from '../context/AccessibilityContext';
import 'leaflet/dist/leaflet.css';

const startExplorationPath = '/especies';

export function LandingPage() {
  const { t } = useTranslation('landing');
  const { i18n } = useTranslation();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const { speak } = useAccessibility();

  useEffect(() => {
    getDestinos().then(setDestinos);
  }, []);

  useEffect(() => {
    // Leer textos principales cuando se carga la página
    const textToSpeak = `${t('title')}. ${t('subtitle')}. ${t('message')}`;
    speak(textToSpeak, i18n.language);
  }, [t, i18n.language, speak]);

  return (
    <div className="landing-page space-y-8">
      <div className="hero-bleed">
        <section className="hero-section relative overflow-hidden w-full">
        <img
          src="fondo.jpg"
          alt="Naturaleza"
          className="hero-bg absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent z-10" />
        <div className="hero-content absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 z-20">
          <h1 className="hero-title">{t('title')}</h1>
          <p className="hero-sub">{t('subtitle')}</p>
          <p className="hero-message text-emerald-200 max-w-xl">{t('message')}</p>
          <Link to={startExplorationPath}>
            <Button size="lg" variant="amber" className="hero-cta">
              {t('cta')}
            </Button>
          </Link>
        </div>
        <footer className="landing-copyright">
          © {new Date().getFullYear()} NaturaTech. Todos los derechos reservados.
        </footer>
        </section>
      </div>
      <section>
        <div className="rounded-2xl overflow-hidden border border-emerald-200 h-[280px]">
          <MapContainer center={[-10, -76]} zoom={5} className="h-full w-full" scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {destinos.map((d) => (
              <CircleMarker
                key={d.id}
                center={[d.ubicacion.lat, d.ubicacion.lng]}
                radius={10}
                pathOptions={{ color: '#059669', fillColor: '#10b981', fillOpacity: 0.8 }}
              >
                <Popup>{getTexto(d.nombre, i18n.language)}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
