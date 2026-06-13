import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  const selectClassName = `language-select rounded-full bg-white border border-emerald-100 shadow-sm text-sm font-medium ${
    compact ? 'px-2 py-1.5' : 'px-3 py-2'
  }`;

  return (
    <div className="relative" role="group" aria-label="Language selector">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className={selectClassName}
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
