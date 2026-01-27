// Implementación simple y robusta de i18n sin dependencias externas para evitar problemas de bundling en web
import * as Localization from 'expo-localization';

const translations = {
  en: require('./locales/en.json'),
  es: require('./locales/es.json'),
};

const ALLOWED = ['en', 'es'];

const normalizeLocale = (locale) => {
  if (!locale) return 'en';
  return String(locale).split('-')[0];
};

let currentLocale = normalizeLocale(Localization.locale || 'en');
if (!ALLOWED.includes(currentLocale)) currentLocale = 'en';

export const setI18nConfig = (locale) => {
  const short = normalizeLocale(locale);
  currentLocale = ALLOWED.includes(short) ? short : 'en';
};

const getNested = (obj, path) => {
  if (!obj) return undefined;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

const safeReplace = (s, params) => {
  if (!params || typeof s !== 'string') return s;
  let out = s;
  for (const [k, v] of Object.entries(params)) {
    // escape key for regex
    const re = new RegExp('%\\{' + k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + '\\}', 'g');
    out = out.replace(re, String(v));
  }
  return out;
};

export const t = (key, params) => {
  try {
    // ensure currentLocale valid
    if (!ALLOWED.includes(currentLocale)) currentLocale = 'en';

    const fromLocale = getNested(translations[currentLocale], key);
    if (fromLocale !== undefined) return safeReplace(fromLocale, params);

    // fallback to English
    const fallback = getNested(translations['en'], key);
    if (fallback !== undefined) return safeReplace(fallback, params);

    return key;
  } catch (err) {
    console.warn('i18n.t error', err, { key, params, currentLocale });
    return key;
  }
};

export default {
  t,
  setI18nConfig,
  translations,
};
