import { Lock } from 'lucide-react';
import type { Especie } from '../types';
import { getPublicAssetUrl, getTexto } from '../utils';
import { useTranslation } from 'react-i18next';

interface SpeciesCardProps {
  especie: Especie;
  discovered: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function SpeciesCard({ especie, discovered, onClick, compact }: SpeciesCardProps) {
  const { i18n } = useTranslation();
  const { t } = useTranslation('especies');
  const imageUrl = getPublicAssetUrl(especie.imagen) ?? especie.imagen;

  return (
    <div
      className={`rounded-[var(--card-radius)] overflow-hidden border transition-all ${
        discovered
          ? 'border-emerald-100 bg-white shadow-md hover:shadow-2xl transform hover:-translate-y-1'
          : 'border-gray-200 bg-gray-100 grayscale opacity-80'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`relative ${compact ? 'h-28' : 'h-36'} bg-emerald-100 card-media`}>
        {discovered ? (
          <img
            src={imageUrl}
            alt={getTexto(especie.nombre, i18n.language)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
            {especie.silueta}
          </div>
        )}
        {!discovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Lock className="text-white" size={24} />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-emerald-900">
          {discovered ? getTexto(especie.nombre, i18n.language) : '???'}
        </p>
        <p className="text-xs text-gray-500">{discovered ? t('discovered') : t('locked')}</p>
      </div>
    </div>
  );
}

export function SpeciesDetailCard({ especie, confianza }: { especie: Especie; confianza?: number }) {
  const { i18n } = useTranslation();
  const { t } = useTranslation('especies');
  const imageUrl = getPublicAssetUrl(especie.imagen) ?? especie.imagen;

  const fields = [
    { label: t('habitat'), value: especie.habitat },
    { label: t('feeding'), value: especie.alimentacion },
    { label: t('facts'), value: especie.curiosidades },
    { label: t('ecology'), value: especie.importanciaEcologica },
  ];

  return (
    <div className="space-y-4">
      <img
        src={imageUrl}
        alt={getTexto(especie.nombre, i18n.language)}
        className="w-full h-48 object-cover rounded-xl"
      />
      <div>
        <h3 className="text-2xl font-bold text-emerald-900">
          {getTexto(especie.nombre, i18n.language)}
        </h3>
        {confianza !== undefined && (
          <p className="text-sm text-amber-600 font-medium">
            {t('confidence')}: {Math.round(confianza * 100)}%
          </p>
        )}
      </div>
      {fields.map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{label}</p>
          <p className="text-sm text-gray-700 mt-1">{getTexto(value, i18n.language)}</p>
        </div>
      ))}
    </div>
  );
}
