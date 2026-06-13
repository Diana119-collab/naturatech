import { useTranslation } from 'react-i18next';
import { useProgress } from '../context/ProgressContext';

export function ExplorerIdBadge() {
  const { t } = useTranslation('common');
  const { progress, getNivelTitulo } = useProgress();

  if (!progress) return null;

  return (
    <div className="hidden sm:flex flex-col items-end text-right">
      <span className="text-xs text-emerald-600 font-medium">
        {t('explorer.id')}: <span className="font-mono font-bold">{progress.explorerId}</span>
      </span>
      <span className="text-xs text-amber-600">
        {t('explorer.level')} {progress.nivel}: {getNivelTitulo()} · {progress.puntos} {t('explorer.points')}
      </span>
    </div>
  );
}

export function ExploradorBadge({ compact }: { compact?: boolean }) {
  const { progress, getNivelTitulo } = useProgress();
  const { t } = useTranslation('common');

  if (!progress) return null;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
      </span>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl px-4 py-3">
      <p className="text-xs opacity-80">{t('explorer.level')} {progress.nivel}</p>
      <p className="font-bold">{getNivelTitulo()}</p>
      <p className="text-sm">{progress.puntos} {t('explorer.points')}</p>
    </div>
  );
}
