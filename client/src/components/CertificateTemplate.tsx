import { forwardRef } from 'react';
import type { Destino } from '../types';
import { getTexto, formatDate } from '../utils';
import { useTranslation } from 'react-i18next';

interface CertificateTemplateProps {
  destino: Destino;
  explorerId: string;
  especiesNombres: string[];
  date: Date;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  function CertificateTemplate({ destino, explorerId, especiesNombres, date }, ref) {
    const { i18n } = useTranslation();
    const { t } = useTranslation('certificado');

    return (
      <div
        ref={ref}
        className="bg-white p-8 sm:p-12 rounded-2xl border-4 border-emerald-600 text-center max-w-2xl mx-auto"
      >
        <div className="text-5xl mb-4">🌿</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-2">{t('congrats')}</h1>
        <p className="text-lg text-emerald-600 mb-6">
          {t('completed')} NaturaTech {getTexto(destino.nombre, i18n.language)}
        </p>
        <div className="border-t border-b border-emerald-200 py-6 my-6 space-y-3 text-left">
          <p><strong>{t('name')}:</strong> {explorerId}</p>
          <p><strong>{t('date')}:</strong> {formatDate(date, i18n.language)}</p>
          <div>
            <strong>{t('species')}:</strong>
            <ul className="list-disc list-inside mt-1 text-emerald-800">
              {especiesNombres.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-500">NaturaTech · Turismo sostenible · Perú</p>
      </div>
    );
  }
);
