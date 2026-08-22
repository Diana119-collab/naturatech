import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { speakText } from '../utils';

interface AccessibilitySettings {
  voiceEnabled: boolean;
  largeText: boolean;
  highContrast: boolean;
}

interface AccessibilityContextValue extends AccessibilitySettings {
  toggleVoice: () => void;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  speak: (text: string, lang: string) => void;
}

const STORAGE_KEY = 'naturatech_a11y';

const defaultSettings: AccessibilitySettings = {
  voiceEnabled: false,
  largeText: false,
  highContrast: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      /* ignore */
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    const root = document.documentElement;
    root.dataset.a11yLarge = settings.largeText ? 'true' : 'false';
    root.dataset.a11yContrast = settings.highContrast ? 'true' : 'false';
  }, [settings]);

  const update = (partial: Partial<AccessibilitySettings>) => {
    setSettings((s) => ({ ...s, ...partial }));
  };

  const speak = (text: string, lang: string) => {
    if (settings.voiceEnabled) speakText(text, lang);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        toggleVoice: () => update({ voiceEnabled: !settings.voiceEnabled }),
        toggleLargeText: () => update({ largeText: !settings.largeText }),
        toggleHighContrast: () => update({ highContrast: !settings.highContrast }),
        speak,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
