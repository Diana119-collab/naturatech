import { Accessibility, Volume2, Type, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('common');
  const {
    voiceEnabled,
    largeText,
    highContrast,
    toggleVoice,
    toggleLargeText,
    toggleHighContrast,
  } = useAccessibility();

  const toggles = [
    { icon: Volume2, label: t('a11y.voice'), active: voiceEnabled, toggle: toggleVoice },
    { icon: Type, label: t('a11y.largeText'), active: largeText, toggle: toggleLargeText },
    { icon: Sun, label: t('a11y.highContrast'), active: highContrast, toggle: toggleHighContrast },
  ];

  return (
    <div className="accessibility-popup">
      <button
        onClick={() => setOpen(!open)}
        className="accessibility-popup-button"
        aria-label={t('a11y.title')}
        aria-expanded={open}
        aria-controls="accessibility-options"
      >
        <Accessibility size={24} />
      </button>
      {open && (
        <div
          id="accessibility-options"
          className="accessibility-popup-card animate-slide-up"
        >
          <h3 className="accessibility-popup-title">{t('a11y.title')}</h3>
          <div className="accessibility-popup-options">
            {toggles.map(({ icon: Icon, label, active, toggle }) => (
              <button
                key={label}
                onClick={toggle}
                className={`accessibility-popup-option ${active ? 'is-active' : ''}`}
                aria-pressed={active}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
