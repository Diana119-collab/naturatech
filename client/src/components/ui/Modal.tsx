import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const { t } = useTranslation('common');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className="relative bg-white rounded-[var(--card-radius)] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up border border-emerald-50"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-emerald-100 px-5 py-4 flex items-center justify-between">
          {title && <h2 className="text-lg font-bold text-emerald-900">{title}</h2>}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-700"
            aria-label={t('actions.close')}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
