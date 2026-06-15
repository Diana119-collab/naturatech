import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getDestinos } from '../services/destinoService';
import type { Destino } from '../types';
import { getTexto } from '../utils';
import { useProgress } from '../context/ProgressContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { CertificateTemplate } from '../components/CertificateTemplate';
import { Button } from '../components/ui/Button';

export function CertificadoPage() {
  const { t } = useTranslation('certificado');
  const { t: tCommon } = useTranslation('common');
  const { i18n } = useTranslation();
  const { progress, isDestinoCompleted } = useProgress();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const certRef = useRef<HTMLDivElement>(null);
  const { speak } = useAccessibility();

  useEffect(() => {
    getDestinos().then(setDestinos);
  }, []);

  useEffect(() => {
    // Leer título y mensaje cuando se carga la página
    const completedDestinos = destinos.filter((d) => isDestinoCompleted(d));
    const latestDestino = completedDestinos[completedDestinos.length - 1];
    
    if (latestDestino && progress) {
      const textToSpeak = `${t('title')}. Certificado por explorar ${getTexto(latestDestino.nombre, i18n.language)}.`;
      speak(textToSpeak, i18n.language);
    } else {
      speak(t('notReady'), i18n.language);
    }
  }, [destinos, progress, t, i18n.language, speak, isDestinoCompleted]);

  const completedDestinos = destinos.filter((d) => isDestinoCompleted(d));
  const latestDestino = completedDestinos[completedDestinos.length - 1];

  const downloadPdf = async () => {
    if (!certRef.current || !latestDestino || !progress) return;
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 10, 10, w - 20, h - 20);
    pdf.save(`NaturaTech-${latestDestino.slug}.pdf`);
  };

  if (!latestDestino || !progress) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl">🏅</div>
        <h1 className="text-2xl font-bold text-emerald-900">{t('title')}</h1>
        <p className="text-gray-600">{t('notReady')}</p>
        <Link to="/destinos">
          <Button variant="amber">{t('goExplore')}</Button>
        </Link>
      </div>
    );
  }

  const especiesNombres = latestDestino.especies.map((e) =>
    getTexto(e.nombre, i18n.language)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-900 text-center">{t('title')}</h1>

      <CertificateTemplate
        ref={certRef}
        destino={latestDestino}
        explorerId={progress.explorerId}
        especiesNombres={especiesNombres}
        date={new Date()}
      />

      <div className="text-center">
        <Button variant="amber" onClick={downloadPdf}>
          <Download size={18} />
          {tCommon('actions.download')}
        </Button>
      </div>
    </div>
  );
}
