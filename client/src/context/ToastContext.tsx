import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Achievement } from '../types';
import { getTexto } from '../utils';
import { useTranslation } from 'react-i18next';

interface Toast {
  id: string;
  achievement: Achievement;
}

interface ToastContextValue {
  toasts: Toast[];
  showAchievement: (achievement: Achievement) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { i18n } = useTranslation();

  const showAchievement = useCallback(
    (achievement: Achievement) => {
      const id = `${achievement.id}-${Date.now()}`;
      setToasts((t) => [...t, { id, achievement }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showAchievement, dismissToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-slide-in bg-amber-500 text-white px-5 py-4 rounded-xl shadow-lg max-w-sm"
            role="alert"
          >
            <p className="font-bold text-lg">
              {getTexto(toast.achievement.titulo, i18n.language)}
            </p>
            <p className="text-sm opacity-90">
              {getTexto(toast.achievement.mensaje, i18n.language)}
            </p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
