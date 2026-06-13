import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esCommon from './locales/es/common.json';
import esLanding from './locales/es/landing.json';
import esDestinos from './locales/es/destinos.json';
import esExplorar from './locales/es/explorar.json';
import esEspecies from './locales/es/especies.json';
import esIa from './locales/es/ia.json';
import esCertificado from './locales/es/certificado.json';
import esAdmin from './locales/es/admin.json';

import enCommon from './locales/en/common.json';
import enLanding from './locales/en/landing.json';
import enDestinos from './locales/en/destinos.json';
import enExplorar from './locales/en/explorar.json';
import enEspecies from './locales/en/especies.json';
import enIa from './locales/en/ia.json';
import enCertificado from './locales/en/certificado.json';
import enAdmin from './locales/en/admin.json';

import ptCommon from './locales/pt/common.json';
import ptLanding from './locales/pt/landing.json';
import ptDestinos from './locales/pt/destinos.json';
import ptExplorar from './locales/pt/explorar.json';
import ptEspecies from './locales/pt/especies.json';
import ptIa from './locales/pt/ia.json';
import ptCertificado from './locales/pt/certificado.json';
import ptAdmin from './locales/pt/admin.json';

const savedLang = localStorage.getItem('naturatech_lang') || 'es';

i18n.use(initReactI18next).init({
  resources: {
    es: {
      common: esCommon,
      landing: esLanding,
      destinos: esDestinos,
      explorar: esExplorar,
      especies: esEspecies,
      ia: esIa,
      certificado: esCertificado,
      admin: esAdmin,
    },
    en: {
      common: enCommon,
      landing: enLanding,
      destinos: enDestinos,
      explorar: enExplorar,
      especies: enEspecies,
      ia: enIa,
      certificado: enCertificado,
      admin: enAdmin,
    },
    pt: {
      common: ptCommon,
      landing: ptLanding,
      destinos: ptDestinos,
      explorar: ptExplorar,
      especies: ptEspecies,
      ia: ptIa,
      certificado: ptCertificado,
      admin: ptAdmin,
    },
  },
  lng: savedLang,
  fallbackLng: 'es',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;

export function changeLanguage(lang: string) {
  localStorage.setItem('naturatech_lang', lang);
  return i18n.changeLanguage(lang);
}
