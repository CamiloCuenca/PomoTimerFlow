// Minimal compatibility shim: export t, setI18nConfig, getLocale safely.
// Recommended: use the hook `useI18n` from './hooks/useI18n'
import * as Localization from 'expo-localization';
import { STRINGS } from './strings';

const ALLOWED = ['en', 'es'];
const normalize = (l) => {
  if (!l) return 'en';
  return String(l).split('-')[0].toLowerCase();
};

let _locale = (function () {
  try {
    const d = normalize(Localization.locale);
    return ALLOWED.includes(d) ? d : 'en';
  } catch (e) {
    return 'en';
  }
})();

export const setI18nConfig = (loc) => {
  const short = normalize(loc);
  _locale = ALLOWED.includes(short) ? short : 'en';
  return _locale;
};

export const getLocale = () => _locale;

const safeLookup = (locale, key) => {
  try {
    const parts = key.split('.');
    let cur = STRINGS[locale] || {};
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
      else {
        cur = undefined;
        break;
      }
    }
    return cur;
  } catch (e) {
    return undefined;
  }
};

const formatReplace = (s, params) => {
  if (!params || typeof s !== 'string') return s;
  return s.replace(/%\{([^}]+)\}/g, (_, k) => (params[k] !== undefined ? String(params[k]) : `%{${k}}`));
};

export const t = (key, params) => {
  try {
    const cur = _locale || normalize(Localization.locale) || 'en';
    let val = safeLookup(cur, key);
    if (val === undefined) val = safeLookup('en', key);
    if (val === undefined) return key;
    if (typeof val !== 'string') return String(val);
    return formatReplace(val, params);
  } catch (e) {
    return key;
  }
};

export default {
  t,
  setI18nConfig,
  getLocale,
};
