import { useState, useRef } from 'react';
import { Camera, Upload, Volume2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Destino, Especie } from '../types';
import { identificarPorFoto, identificarPorSonido, getSonidosDisponibles } from '../services/aiService';
import { SpeciesDetailCard } from './SpeciesCard';
import { Button } from './ui/Button';

type Tab = 'upload' | 'camera' | 'sound';

interface IdentificadorEspecieProps {
  destino: Destino;
  especiesDescubiertas: string[];
  onConfirm: (especie: Especie) => void;
}

export function IdentificadorEspecie({
  destino,
  especiesDescubiertas,
  onConfirm,
}: IdentificadorEspecieProps) {
  const { t } = useTranslation('especies');
  const { t: tCommon } = useTranslation('common');
  const [tab, setTab] = useState<Tab>('upload');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ especie: Especie; confianza: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const tabs: { id: Tab; icon: typeof Upload; label: string }[] = [
    { id: 'upload', icon: Upload, label: t('upload') },
    { id: 'camera', icon: Camera, label: t('camera') },
    { id: 'sound', icon: Volume2, label: t('sound') },
  ];

  const handleFile = async (file?: File) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await identificarPorFoto(destino, especiesDescubiertas, file);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleSound = async (sonidoId: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await identificarPorSonido(destino, sonidoId);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const sonidos = getSonidosDisponibles(destino);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-emerald-900">{t('identifyTitle')}</h3>

      <div className="flex gap-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setResult(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
              tab === id ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {tab === 'upload' && (
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button onClick={() => fileRef.current?.click()} className="w-full" disabled={loading}>
            <Upload size={18} />
            {t('upload')}
          </Button>
          <p className="text-xs text-gray-500 text-center">Demo: cualquier imagen funciona</p>
        </div>
      )}

      {tab === 'camera' && (
        <div>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button onClick={() => cameraRef.current?.click()} className="w-full" disabled={loading}>
            <Camera size={18} />
            {t('camera')}
          </Button>
        </div>
      )}

      {tab === 'sound' && (
        <div className="grid grid-cols-2 gap-2">
          {sonidos.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSound(s.id)}
              disabled={loading}
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-medium transition-colors"
            >
              🔊 {s.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-emerald-600">
          <Loader2 className="animate-spin" size={24} />
          <span className="font-medium">{t('analyzing')}</span>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4 border-t border-emerald-100 pt-4">
          <SpeciesDetailCard especie={result.especie} confianza={result.confianza} />
          <Button
            variant="amber"
            className="w-full"
            onClick={() => onConfirm(result.especie)}
          >
            {tCommon('actions.confirm')}
          </Button>
        </div>
      )}
    </div>
  );
}
