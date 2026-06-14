import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { getDestinos } from '../services/destinoService';
import type { Destino } from '../types';
import { getTexto } from '../utils';
import 'leaflet/dist/leaflet.css';

const startExplorationPath = '/explorar/la-arenilla';

export function LandingPage() {
  const { t } = useTranslation('landing');
  const { i18n } = useTranslation();
  const [destinos, setDestinos] = useState<Destino[]>([]);

  useEffect(() => {
    getDestinos().then(setDestinos);
  }, []);

  return (
    <div className="landing-page space-y-8">
      <div className="hero-bleed">
        <section className="hero-section relative overflow-hidden w-full">
        <img
          src="https://scontent.flim38-1.fna.fbcdn.net/v/t39.30808-6/480829594_1070740818422409_1275393746041873640_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1283&ctp=s2048x1283&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=7IaQsTn-N9UQ7kNvwHN7_3e&_nc_oc=AdqayzYfzd91u2b20mkl8Zw8bSNXOpq488KWCyhg9i5ykjH5H20SbsjoW20699U_g9U&_nc_zt=23&_nc_ht=scontent.flim38-1.fna&_nc_gid=hXxWELl3bOw3Njg5-MgpzQ&_nc_ss=7b289&oh=00_Af9ndbgLqufXe__uI4i2YJEJRf6zjn-zoJZ3ePLC8QgCAg&oe=6A33AB13"
          alt="Naturaleza"
          className="hero-bg absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent z-10" />
        <div className="hero-content absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 z-20">
          <h1 className="hero-title">Humedal Costero Poza de La Arenilla</h1>
          <p className="hero-sub">{t('subtitle')}</p>
          <p className="hero-message text-emerald-200 max-w-xl">{t('message')}</p>
          <Link to={startExplorationPath}>
            <Button size="lg" variant="amber" className="hero-cta">
              {t('cta')}
            </Button>
          </Link>
        </div>
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
