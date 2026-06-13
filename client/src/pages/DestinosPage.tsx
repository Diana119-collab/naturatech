import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDestinos } from '../services/destinoService';
import type { Destino } from '../types';
import { getTexto } from '../utils';
import { useProgress } from '../context/ProgressContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function DestinosPage() {
  const { t } = useTranslation('destinos');
  const { i18n } = useTranslation();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const { getDiscoveredCount, isDestinoCompleted } = useProgress();

  useEffect(() => {
    getDestinos().then(setDestinos);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">{t('title')}</h1>
        <p className="text-gray-600 mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid-destinos">
        {destinos.map((destino) => {
          const found = getDiscoveredCount(destino);
          const total = destino.especies.length;
          const completed = isDestinoCompleted(destino);
          const isPreview = destino.preview;

          return (
            <Card key={destino.id} className="flex flex-col card">
              <div className="card-media h-44">
                <img
                  src={destino.imagen}
                  alt={getTexto(destino.nombre, i18n.language)}
                  className={`${isPreview ? 'grayscale' : ''}`}
                />
                {isPreview && (
                  <span className="absolute top-3 right-3 bg-gray-800/80 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Lock size={12} />
                    {t('preview')}
                  </span>
                )}
                {completed && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ✓
                  </span>
                )}
                <div className="absolute left-4 bottom-4 text-white">
                  <h3 className="text-xl font-bold drop-shadow-md">{getTexto(destino.nombre, i18n.language)}</h3>
                  <p className="text-sm opacity-90 max-w-xs">{getTexto(destino.descripcion, i18n.language)}</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="mt-2 mb-3 flex items-center gap-3">
                  <div className="text-xs text-emerald-700">
                    <strong>{t('ecosystem')}:</strong> {getTexto(destino.ecosistema, i18n.language)}
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <div className="w-full bg-emerald-100 rounded-full h-2 mb-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${total ? (found / total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">{t('progress', { found, total })}</p>
                    <div className="ml-auto">
                      {isPreview ? (
                        <Button variant="secondary" className="px-4 py-2" disabled>
                          {t('preview')}
                        </Button>
                      ) : (
                        <Link to={`/explorar/${destino.slug}`}>
                          <Button className="px-4 py-2 inline-flex items-center gap-2">
                            {t('explore')}
                            <ChevronRight size={18} />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
