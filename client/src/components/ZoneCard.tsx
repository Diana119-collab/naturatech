import { Lock, Unlock } from 'lucide-react';
import type { Zona } from '../types';
import { getTexto } from '../utils';
import { useTranslation } from 'react-i18next';

interface ZoneCardProps {
  zona: Zona;
  unlocked: boolean;
  selected?: boolean;
  onClick: () => void;
}

export function ZoneCard({ zona, unlocked, selected, onClick }: ZoneCardProps) {
  const { i18n } = useTranslation();
  const { t } = useTranslation('explorar');

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-emerald-500 bg-emerald-50'
          : unlocked
            ? 'border-emerald-200 bg-white hover:border-emerald-400'
            : 'border-gray-200 bg-gray-50 opacity-70 grayscale'
      } ${unlocked && !selected ? 'animate-pulse-subtle' : ''}`}
      aria-label={`${getTexto(zona.nombre, i18n.language)} - ${unlocked ? t('unlocked') : t('locked')}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{zona.emoji}</span>
        <div className="flex-1">
          <p className="font-bold text-emerald-900">{getTexto(zona.nombre, i18n.language)}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            {unlocked ? (
              <>
                <Unlock size={12} className="text-emerald-600" />
                {t('unlocked')}
              </>
            ) : (
              <>
                <Lock size={12} />
                {t('locked')}
              </>
            )}
          </p>
        </div>
      </div>
    </button>
  );
}
