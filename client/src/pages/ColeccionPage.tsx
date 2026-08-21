import { useEffect, useMemo, useRef, useState } from 'react';
import { AudioLines, Camera, Check, Loader2, Lock, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDestinos } from '../services/destinoService';
import { classifyBirdImage, type BirdPrediction } from '../services/birdRecognition';
import type { Destino, Especie } from '../types';
import { useProgress } from '../context/ProgressContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { getPublicAssetUrl, getTexto } from '../utils';
import { Modal } from '../components/ui/Modal';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function ColeccionPage() {
  const { i18n } = useTranslation();
  const { t } = useTranslation('especies');
  const navigate = useNavigate();
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const soundRef = useRef<HTMLInputElement>(null);
  const { isSpeciesDiscovered, discoverSpecies } = useProgress();
  const { speak } = useAccessibility();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIdentifyModalOpen, setIsIdentifyModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    topPrediction: BirdPrediction | null;
    predictions: BirdPrediction[];
    matchedEspecie: Especie | null;
    message: string;
  } | null>(null);

  useEffect(() => {
    getDestinos().then(setDestinos);
  }, []);

  useEffect(() => {
    if (result?.message) {
      speak(result.message, i18n.language);
    }
  }, [result, i18n.language, speak]);

  const destino = destinos[0];
  const allSpecies = useMemo(() => destinos.flatMap((item) => item.especies), [destinos]);
  const discovered = allSpecies.filter((especie) => isSpeciesDiscovered(especie.id));
  const progressPercent = allSpecies.length ? (discovered.length / allSpecies.length) * 100 : 0;

  const resetSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setIsIdentifyModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (uploadRef.current) uploadRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
    if (soundRef.current) soundRef.current.value = '';
  };

  const handleFile = (file?: File, mode?: 'upload' | 'camera' | 'sound') => {
    if (!file) return;

    if (mode !== 'sound' && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Formato no válido. Sube JPG, JPEG, PNG o WEBP.');
      return;
    }

    if (mode !== 'sound' && file.size > 8 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Usa una imagen menor a 8 MB.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const nextPreview = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(nextPreview);
    setIsIdentifyModalOpen(true);
    setResult(null);
    setError(null);
  };

  const handleIdentify = async () => {
    if (!selectedFile || !destino) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const recognition = await classifyBirdImage(selectedFile, destino, i18n.language);
      if (!recognition) {
        setError('No pudimos procesar la imagen. Intenta con otra foto más clara.');
        return;
      }

      setResult(recognition);

      if (recognition.matchedEspecie) {
        await discoverSpecies(destino, recognition.matchedEspecie.id);
        setIsIdentifyModalOpen(false);
        navigate(`/ave/${recognition.matchedEspecie.id}`);
      }
    } catch {
      setError('Hubo un error al identificar la especie. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusMessage = error ?? result?.message ?? t('message');

  return (
    <div className="identify-page">
      <section className="identify-shell">
        <div className="identify-main">
          <h1>{t('identifyTitle')}</h1>

          <div className="identify-actions">
            <article className="identify-action-card">
              <Upload size={58} />
              <h2>{t('upload')}</h2>
              <p>{t('uploadDescription')}</p>
              <button type="button" onClick={() => uploadRef.current?.click()} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : t('btnUpload')}
              </button>
            </article>

            <article className="identify-action-card">
              <Camera size={58} />
              <h2>{t('camera')}</h2>
              <p>{t('cameraDescription')}</p>
              <button type="button" onClick={() => cameraRef.current?.click()} disabled={isLoading}>
                {t('btnCamera')}
              </button>
            </article>

            <article className="identify-action-card">
              <AudioLines size={58} />
              <h2>{t('sound')}</h2>
              <p>{t('soundDescription')}</p>
              <button type="button" onClick={() => soundRef.current?.click()} disabled={isLoading}>
                {t('btnSound')}
              </button>
            </article>
          </div>

          <input
            ref={uploadRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              handleFile(file, 'upload');
            }}
          />

          <input
            ref={cameraRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              handleFile(file, 'camera');
            }}
          />

          <input
            ref={soundRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              handleFile(file, 'sound');
            }}
          />

          {error && (
            <p className="mt-3 text-sm text-red-700">{error}</p>
          )}
        </div>

        <aside className="identify-challenge" aria-label="Progreso de colección">
          <h2>Visitante</h2>
          <h3>¡Tu Desafío ha empezado!</h3>
          <p>{t('progress', { found: discovered.length, total: allSpecies.length })}</p>
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
                      <img src={getPublicAssetUrl(especie.imagen)} alt={getTexto(especie.nombre, i18n.language)} />
                      <span>{getTexto(especie.nombre, i18n.language).split(' ')[0]}</span>
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

      <Modal
        open={isIdentifyModalOpen && Boolean(selectedFile && previewUrl)}
        onClose={resetSelection}
        title={result?.matchedEspecie ? getTexto(result.matchedEspecie.nombre, i18n.language) : 'Identifica tu ave'}
        variant="identify"
      >
        {previewUrl && (
          <div className="identify-modal-content" aria-live="polite">
            <img src={previewUrl} alt="Vista previa de ave" className="identify-modal-preview" />
            <p className="identify-modal-message">{statusMessage}</p>
            <div className="identify-modal-actions">
              {!result && (
                <button type="button" onClick={handleIdentify} disabled={isLoading} className="identify-action-card-button-main">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Identificar tu ave'}
                </button>
              )}
              <button type="button" onClick={resetSelection} className="identify-action-card-button-secondary">
                Intentar otra vez
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
