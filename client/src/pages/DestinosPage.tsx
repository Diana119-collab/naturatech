import { useEffect, useRef, useState } from 'react';
import { FileText, Pause, Video, Volume2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDestinos } from '../services/destinoService';
import type { Destino, Especie, Idioma } from '../types';
import { getPublicAssetUrl, getPdfUrl as getPdfUrlWithCache, getTexto } from '../utils';
import { useAccessibility } from '../context/AccessibilityContext';

export function DestinosPage() {
  const { i18n } = useTranslation();
  const { t } = useTranslation('destinos');
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<{ especie: Especie; url: string } | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { speak } = useAccessibility();

  useEffect(() => {
    getDestinos().then(setDestinos);
  }, []);

  useEffect(() => {
    // Leer título y descripción cuando se carga la página
    const textToSpeak = `${t('title')}. ${t('description')}`;
    speak(textToSpeak, i18n.language);
  }, [t, i18n.language, speak]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const currentLanguage = (['es', 'en', 'pt'].includes(i18n.language) ? i18n.language : 'es') as Idioma;

  const getPdfUrl = (especie: Especie) => getPdfUrlWithCache(especie.pdfUrls?.[currentLanguage] || especie.pdfUrl);

  const getVideoEmbedUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes('youtube.com')) {
        const videoId = parsedUrl.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }

      if (parsedUrl.hostname.includes('youtu.be')) {
        const videoId = parsedUrl.pathname.replace('/', '');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }

      if (parsedUrl.hostname.includes('vimeo.com')) {
        const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
      }

      return url;
    } catch {
      return url;
    }
  };

  const getAudioSourceUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const filePath = parsedUrl.searchParams.get('id');

      if (parsedUrl.hostname.includes('sharepoint.com') && parsedUrl.pathname.includes('/onedrive.aspx') && filePath) {
        return `${parsedUrl.origin}/_layouts/15/download.aspx?SourceUrl=${encodeURIComponent(filePath)}`;
      }

      return url;
    } catch {
      return url;
    }
  };

  const getMediaUrl = (url: string) => getPublicAssetUrl(url) ?? url;

  const isEmbeddedVideo = (url: string) => {
    const embedUrl = getVideoEmbedUrl(url);
    return (
      embedUrl.includes('youtube.com/embed') ||
      embedUrl.includes('player.vimeo.com/video') ||
      (embedUrl.includes('sharepoint.com') && embedUrl.includes('/stream.aspx'))
    );
  };

  const openUrl = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAudioClick = async (especie: Especie) => {
    if (!especie.audioUrl) return;

    if (playingAudioId === especie.id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(getAudioSourceUrl(getMediaUrl(especie.audioUrl)));
    audioRef.current = audio;
    audio.onended = () => setPlayingAudioId(null);
    audio.onerror = () => setPlayingAudioId(null);

    try {
      await audio.play();
      setPlayingAudioId(especie.id);
    } catch {
      setPlayingAudioId(null);
    }
  };

  return (
    <div className="destinos-species-page">
      <header className="destinos-species-header">
        <p> {t('title')}</p>
        <h1>{t('principalTitle')}</h1>
        <span>
          {t('description')}
        </span>
      </header>

      <div className="destinos-species-grid">
        {destinos.flatMap((destino) =>
          destino.especies.map((especie) => {
            const speciesName = getTexto(especie.nombre, i18n.language);
            const pdfUrl = getPdfUrl(especie);
            const habitatText = getTexto(especie.habitat, i18n.language);

            return (
              <article
                key={`${destino.id}-${especie.id}`}
                className="destinos-species-tile"
                aria-label={speciesName}
              >
                {(pdfUrl || especie.audioUrl || especie.videoUrl) && (
                  <div className="destinos-media-actions">
                    {pdfUrl && (
                      <button
                        type="button"
                        className="destinos-media-button"
                        onClick={() => openUrl(pdfUrl)}
                        aria-label={`Abrir ficha PDF de ${speciesName}`}
                        title="PDF"
                      >
                        <FileText size={16} />
                      </button>
                    )}

                    {especie.audioUrl && (
                      <button
                        type="button"
                        className="destinos-media-button"
                        onClick={() => handleAudioClick(especie)}
                        aria-label={`${playingAudioId === especie.id ? 'Pausar' : 'Escuchar'} audio de ${speciesName}`}
                        title="Audio"
                      >
                        {playingAudioId === especie.id ? <Pause size={16} /> : <Volume2 size={16} />}
                      </button>
                    )}

                    {especie.videoUrl && (
                      <button
                        type="button"
                        className="destinos-media-button"
                        onClick={() => setSelectedVideo({ especie, url: getMediaUrl(especie.videoUrl!) })}
                        aria-label={`Ver video de ${speciesName}`}
                        title="Video"
                      >
                        <Video size={16} />
                      </button>
                    )}
                  </div>
                )}

                <Link
                  to={`/ave/${especie.id}`}
                  className="destinos-species-button"
                  aria-label={`Ver detalles de ${speciesName}`}
                >
                  <span className="destinos-species-image-wrap">
                    <img
                      src={getMediaUrl(especie.imagen)}
                      alt=""
                      className="destinos-species-image"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </span>
                  <span className="destinos-species-name">
                    {speciesName}
                  </span>
                  <span className="destinos-species-text">
                    {habitatText}
                  </span>
                  <span className="destinos-species-link">
                    {t('ficha')}
                  </span>
                </Link>
              </article>
            );
          })
        )}
      </div>

      {selectedVideo && (
        <div className="destinos-video-overlay" role="dialog" aria-modal="true">
          <div className="destinos-video-dialog">
            <div className="destinos-video-header">
              <h2>
                Video: {getTexto(selectedVideo.especie.nombre, i18n.language)}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="destinos-video-close"
                aria-label="Cerrar video"
              >
                <X size={24} />
              </button>
            </div>
            <div className="destinos-video-frame">
              {isEmbeddedVideo(selectedVideo.url) ? (
                <iframe
                  src={getVideoEmbedUrl(selectedVideo.url)}
                  title={`Video de ${getTexto(selectedVideo.especie.nombre, i18n.language)}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={selectedVideo.url} controls autoPlay />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
