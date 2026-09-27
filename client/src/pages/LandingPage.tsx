import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowRight, Leaf } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { getDestinos } from '../services/destinoService';
import type { Destino } from '../types';
import { getPublicAssetUrl, getTexto } from '../utils';
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

  // Resalta la última palabra del título con el color de acento
  const titleWords = t('title').split(' ');
  const titleLast = titleWords.pop();
  const featuredEspecie = destinos[0]?.especies[0];

  return (
    <div className="landing-page space-y-8">
      <div className="hero-bleed">
        <section className="hero-section relative overflow-hidden w-full">
        <img
          src="fondo.jpg"
          alt="Naturaleza"
          className="hero-bg absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0 z-10" />
        <div className="hero-content absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 z-20">
          <p className="nt-hero-kicker">
            <Leaf size={14} /> NaturaTech
          </p>
          <h1 className="hero-title">
            {titleWords.join(' ')} <span className="nt-accent-text">{titleLast}</span>
          </h1>
          <p className="hero-sub">{t('subtitle')}</p>
          <p className="hero-message max-w-xl">{t('message')}</p>
          <Link to={startExplorationPath}>
            <Button size="lg" variant="amber" className="hero-cta">
              {t('cta')}
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        <Link to="/destinos" className="nt-featured">
          <p className="nt-featured-label">
            <Leaf size={14} /> {t('hero.featured')}
          </p>
          <div className="nt-featured-body">
            {featuredEspecie && (
              <img src={getPublicAssetUrl(featuredEspecie.imagen)} alt="" />
            )}
            <div>
              <p className="nt-featured-title">{t('hero.featuredTitle')}</p>
              <span className="nt-featured-link">
                <ArrowRight size={14} /> {t('hero.featuredCta')}
              </span>
            </div>
          </div>
        </Link>

        <div className="nt-scroll-cue" aria-hidden="true">
          {t('hero.scroll')}
          <ArrowDown size={16} />
        </div>
        </section>
      </div>
      <section>
        <div className="nt-section-head">
          <p className="nt-eyebrow">{t('hero.mapEyebrow')}</p>
          <h2 className="nt-section-title">{t('hero.mapTitle')}</h2>
        </div>
        <div className="nt-map-frame">
          <MapContainer center={[-10, -76]} zoom={5} className="h-full w-full" scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {destinos.map((d) => (
              <CircleMarker
                key={d.id}
                center={[d.ubicacion.lat, d.ubicacion.lng]}
                radius={10}
                pathOptions={{ color: '#c8e632', fillColor: '#c8e632', fillOpacity: 0.85, weight: 3 }}
              >
                <Popup>{getTexto(d.nombre, i18n.language)}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </section>
      <footer className="landing-copyright site-copyright-footer">
        © {new Date().getFullYear()} NaturaTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}
