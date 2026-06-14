import { useEffect, useMemo, useRef, useState } from 'react';
import { AudioLines, Camera, Check, Loader2, Lock, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDestinos } from '../services/destinoService';
import { identificarPorFoto, identificarPorSonido } from '../services/aiService';
import type { Destino, Especie, IdentificacionResult } from '../types';
import { useProgress } from '../context/ProgressContext';
import { getPublicAssetUrl, getTexto } from '../utils';

type IdentifyMode = 'upload' | 'camera' | 'sound';

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function findSpeciesFromFileName(file: File, species: Especie[]) {
  const fileName = normalizeText(file.name);

  return species.find((especie) => {
    const names = [
      especie.id,
      especie.sonido ?? '',
      especie.nombre.es,
      especie.nombre.en,
      especie.nombre.pt,
    ].map(normalizeText);

    return names.some((name) => name && (fileName.includes(name.replaceAll(' ', '-')) || fileName.includes(name)));
  });
}

export function ColeccionPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loadingMode, setLoadingMode] = useState<IdentifyMode | null>(null);
  const [message, setMessage] = useState('Sube una foto, toma una foto o carga un sonido para identificar el ave.');
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const soundRef = useRef<HTMLInputElement>(null);
  const { progress, isSpeciesDiscovered, discoverSpecies } = useProgress();

  useEffect(() => {
    getDestinos().then(setDestinos);
  }, []);

  const destino = destinos[0];
  const allSpecies = useMemo(() => destinos.flatMap((item) => item.especies), [destinos]);
  const discovered = allSpecies.filter((especie) => isSpeciesDiscovered(especie.id));
  const progressPercent = allSpecies.length ? (discovered.length / allSpecies.length) * 100 : 0;

  const finishIdentification = async (result: IdentificacionResult) => {
    if (!destino) return;

    await discoverSpecies(destino, result.especie.id);
    setMessage(`Encontré ${getTexto(result.especie.nombre, i18n.language)} con ${Math.round(result.confianza * 100)}% de confianza. Abriendo su ficha...`);
    window.setTimeout(() => navigate(`/ave/${result.especie.id}`), 700);
  };

  const identifyFromFile = async (mode: IdentifyMode, file?: File) => {
    if (!destino || !file) return;

    setLoadingMode(mode);
    setMessage('Analizando con IA...');

    try {
      const matched = findSpeciesFromFileName(file, destino.especies);
      const result = matched
        ? { especie: matched, confianza: 0.96 }
        : mode === 'sound'
          ? await identificarPorSonido(destino, destino.especies.find((especie) => especie.sonido)?.sonido ?? '')
          : await identificarPorFoto(destino, progress?.especiesDescubiertas ?? [], file);

      await finishIdentification(result);
    } catch {
      setMessage('Lo sentimos, no se pudo encontrar la especie. Revisa las especies actuales de La Arenilla para inspirarte.');
    } finally {
      setLoadingMode(null);
    }
  };

  const actions = [
    {
      id: 'upload' as const,
      title: 'Subir Foto',
      description: 'Sube una foto de tu galería',
      button: 'Subir',
      icon: Upload,
      onClick: () => uploadRef.current?.click(),
      loading: loadingMode === 'upload',
    },
    {
      id: 'camera' as const,
      title: 'Tomar Foto',
      description: 'Usa tu cámara para capturar al ave',
      button: 'Tomar Foto',
      icon: Camera,
      onClick: () => cameraRef.current?.click(),
      loading: loadingMode === 'camera',
    },
    {
      id: 'sound' as const,
      title: 'Elegir Sonido',
      description: 'Carga o graba un sonido de canto',
      button: 'Elegir Audio',
      icon: AudioLines,
      onClick: () => soundRef.current?.click(),
      loading: loadingMode === 'sound',
    },
  ];

  return (
    <div className="identify-page">
      <section className="identify-shell">
        <div className="identify-main">
          <h1>Identifica tu Ave con IA</h1>

          <div className="identify-actions">
            {actions.map(({ id, title, description, button, icon: Icon, onClick, loading }) => (
              <article className="identify-action-card" key={id}>
                <Icon size={58} />
                <h2>{title}</h2>
                <p>{description}</p>
                <button type="button" onClick={onClick} disabled={!!loadingMode}>
                  {loading ? <Loader2 className="animate-spin" size={18} /> : button}
                </button>
              </article>
            ))}
          </div>

          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => identifyFromFile('upload', event.target.files?.[0])}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => identifyFromFile('camera', event.target.files?.[0])}
          />
          <input
            ref={soundRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(event) => identifyFromFile('sound', event.target.files?.[0])}
          />
        </div>

        <aside className="identify-challenge" aria-label="Progreso de colección">
          <h2>Gamer</h2>
          <h3>¡Tu Desafío de Colección!</h3>
          <p>Tu progreso: {discovered.length} de {allSpecies.length} aves desbloqueadas</p>
          <div className="identify-progress-row">
            <div className="identify-progress">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <Check size={34} />
          </div>

          <div className="identify-unlocks">
            {allSpecies.slice(0, 4).map((especie) => {
              const unlocked = isSpeciesDiscovered(especie.id);
              return (
                <button
                  type="button"
                  key={especie.id}
                  className={`identify-unlock ${unlocked ? 'is-unlocked' : ''}`}
                  onClick={() => unlocked && navigate(`/ave/${especie.id}`)}
                >
                  {unlocked ? (
                    <>
                      <img src={getPublicAssetUrl(especie.imagen)} alt="" />
                      <span>¡Desbloqueado!</span>
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      <strong>???</strong>
                      <span>Por descubrir</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </aside>
      </section>

      <section className="identify-result-card" aria-live="polite">
        <Camera size={20} />
        <p>{message}</p>
        <div className="identify-suggestions">
          {allSpecies.slice(0, 3).map((especie) => (
            <button type="button" key={especie.id} onClick={() => navigate(`/ave/${especie.id}`)}>
              <img src={getPublicAssetUrl(especie.imagen)} alt="" />
              <span>{getTexto(especie.nombre, i18n.language).split(' ')[0]}</span>
            </button>
          ))}
          <button type="button" className="identify-all-button" onClick={() => navigate('/destinos')}>
            Ver todas
          </button>
        </div>
      </section>

      {progress && (
        <p className="identify-code">{progress.explorerId}</p>
      )}
    </div>
  );
}
