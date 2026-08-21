import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'identify';
}

export function Modal({ open, onClose, title, children, variant = 'default' }: ModalProps) {
  const { t } = useTranslation('common');

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 modal-overlay modal-overlay-${variant}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className={`relative w-full max-h-[90vh] overflow-y-auto animate-slide-up modal-dialog modal-dialog-${variant}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={`modal-header modal-header-${variant}`}>
          {title && <h2>{title}</h2>}
          <button
            onClick={onClose}
            className={`modal-close modal-close-${variant}`}
            aria-label={t('actions.close')}
          >
            <X size={variant === 'identify' ? 28 : 20} />
          </button>
        </div>
        <div className={`modal-body modal-body-${variant}`}>{children}</div>
      </div>
    </div>
  );
}
