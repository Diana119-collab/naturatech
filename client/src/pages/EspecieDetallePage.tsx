import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, FileText, MapPin, ShieldCheck, Video } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDestinos } from '../services/destinoService';
import type { Destino, Especie, Idioma } from '../types';
import { getPublicAssetUrl, getTexto } from '../utils';

type SpeciesMatch = {
  destino: Destino;
  especie: Especie;
};

export function EspecieDetallePage() {
  const { especieId } = useParams();
  const { i18n } = useTranslation();
  const [match, setMatch] = useState<SpeciesMatch | null | undefined>(undefined);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    getDestinos().then((destinos) => {
      const found = destinos
        .flatMap((destino) => destino.especies.map((especie) => ({ destino, especie })))
        .find(({ especie }) => especie.id === especieId);

      setMatch(found ?? null);
    });
  }, [especieId]);

  if (match === undefined) {
    return <div className="species-detail-loading">Cargando especie...</div>;
  }

  if (!match) {
    return <Navigate to="/destinos" replace />;
  }

  const { destino, especie } = match;
  const currentLanguage = (['es', 'en', 'pt'].includes(i18n.language) ? i18n.language : 'es') as Idioma;
  const speciesName = getTexto(especie.nombre, i18n.language);
  const pdfUrl = especie.pdfUrls?.[currentLanguage] || especie.pdfUrl;
  const habitat = getTexto(especie.habitat, i18n.language);
  const alimentacion = getTexto(especie.alimentacion, i18n.language);
  const curiosidades = getTexto(especie.curiosidades, i18n.language);
  const importancia = getTexto(especie.importanciaEcologica, i18n.language);
  const description = `${habitat}. ${alimentacion}. ${curiosidades}`;
  const imageUrl = getPublicAssetUrl(especie.imagen) ?? especie.imagen;
  const audioUrl = getPublicAssetUrl(especie.audioUrl);
  const videoUrl = getPublicAssetUrl(especie.videoUrl);

  const isEmbeddedVideo =
    videoUrl?.includes('youtube.com') ||
    videoUrl?.includes('youtu.be') ||
    videoUrl?.includes('vimeo.com') ||
    videoUrl?.includes('sharepoint.com');

  return (
    <article className="species-detail-page">
      <section className="species-detail-hero">
        <div className="species-detail-hero-inner">
          <div className="species-detail-portrait">
            <img
              src={imageUrl}
              alt={speciesName}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="species-detail-summary">
            <Link to="/destinos" className="species-detail-back">
              <ArrowLeft size={16} />
              Especies
            </Link>
            <h1>{speciesName}</h1>
            <p className="species-detail-scientific">{getTexto(especie.nombre, 'en')}</p>
            <p className="species-detail-description">{description}</p>
          </div>

          <aside className="species-detail-side" aria-label={`Datos de ${speciesName}`}>
            <div className="species-detail-languages">
              <p><strong>ES</strong> / {especie.nombre.es}</p>
              <p><strong>ENG</strong> / {especie.nombre.en}</p>
              <p><strong>PT</strong> / {especie.nombre.pt}</p>
            </div>

            <div className="species-detail-status">
              <ShieldCheck size={40} />
              <div>
                <h2>Especie emblemática</h2>
                <p>{importancia}</p>
              </div>
            </div>

            <div className="species-detail-presence">
              <MapPin size={40} />
              <div>
                <h2>Presencia</h2>
                <p>{getTexto(destino.nombre, i18n.language)} | {especie.zonaId.replace('zona-', '')}</p>
              </div>
            </div>

            {audioUrl && (
              <div className="species-detail-audio">
                <p>Escucha su canto:</p>
                <audio src={audioUrl} controls preload="metadata">
                  Tu navegador no soporta la reproducción de audio.
                </audio>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="species-detail-content">
        <div className="species-detail-tabs" aria-label="Secciones de información">
          <a href="#informacion">INFORMACIÓN</a>
          <a href="#habitat">HÁBITAT</a>
          <a href="#alimentacion">ALIMENTACIÓN</a>
          <a href="#conservacion">CONSERVACIÓN</a>
          {videoUrl && <a href="#video">VÍDEO</a>}
        </div>

        <div className="species-detail-main">
          <section id="informacion" className="species-detail-section">
            <h2>{speciesName}</h2>
            <p className="species-detail-section-kicker">{getTexto(especie.nombre, 'en')}</p>
            <h3>Información</h3>
            <p>{curiosidades}</p>
          </section>

          <section id="habitat" className="species-detail-section">
            <h3>Hábitat</h3>
            <p>{habitat}</p>
          </section>

          <section id="alimentacion" className="species-detail-section">
            <h3>Alimentación</h3>
            <p>{alimentacion}</p>
          </section>

          <section id="conservacion" className="species-detail-section">
            <h3>Importancia ecológica</h3>
            <p>{importancia}</p>
          </section>

          <div className="species-detail-actions">
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noreferrer" className="species-detail-action">
                <FileText size={18} />
                Ficha técnica
                <ExternalLink size={14} />
              </a>
            )}
            {videoUrl && (
              <button type="button" className="species-detail-action" onClick={() => setShowVideo(true)}>
                <Video size={18} />
                Ver video
              </button>
            )}
          </div>

          {showVideo && videoUrl && (
            <section id="video" className="species-detail-video">
              <div className="species-detail-video-header">
                <h3>Vídeo</h3>
                <button type="button" onClick={() => setShowVideo(false)}>Cerrar</button>
              </div>
              {isEmbeddedVideo ? (
                <iframe
                  src={videoUrl}
                  title={`Video de ${speciesName}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={videoUrl} controls />
              )}
            </section>
          )}
        </div>
      </section>
    </article>
  );
}
