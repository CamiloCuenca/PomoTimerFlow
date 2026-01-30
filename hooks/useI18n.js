import { useCallback, useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import { STRINGS } from '../strings';
import { setLocaleGlobal, subscribeLocale } from '../i18n';

const STORAGE_KEY = '@PomoTimerFlow:locale';
const ALLOWED = ['en', 'es'];
const normalize = (l) => {
  if (!l) return 'en';
  return String(l).split('-')[0].toLowerCase();
};

const getDeviceLocale = () => {
  try {
    const loc = Localization.locale;
    return normalize(loc);
  } catch (e) {
    return 'en';
  }
};

const safeLookup = (locale, key) => {
  try {
    const parts = key.split('.');
    let cur = (STRINGS[locale] || {});
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
      else { cur = undefined; break; }
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

export const useI18n = () => {
  const [locale, setLocaleState] = useState(() => {
    const device = getDeviceLocale();
    return ALLOWED.includes(device) ? device : 'en';
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Try to read persisted locale; fail silently if AsyncStorage not available
      let stored = null;
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        if (AsyncStorage && AsyncStorage.getItem) {
          stored = await AsyncStorage.getItem(STORAGE_KEY);
        }
      } catch (e) {
        // ignore - not fatal
        stored = null;
      }

      const device = getDeviceLocale();
      const chosen = stored ? normalize(stored) : device;
      const short = ALLOWED.includes(chosen) ? chosen : (ALLOWED.includes(device) ? device : 'en');
      if (mounted) setLocaleState(short);
    })();

    // Subscribe to global locale changes so this hook updates when another part of the app sets locale
    let unsubscribe = null;
    try {
      if (typeof subscribeLocale === 'function') {
        unsubscribe = subscribeLocale((newLocale) => {
          if (mounted && newLocale) {
            const short = normalize(newLocale);
            setLocaleState(ALLOWED.includes(short) ? short : 'en');
          }
        });
      }
    } catch (e) {
      // ignore subscription failures
      unsubscribe = null;
    }

    return () => {
      mounted = false;
      try { if (typeof unsubscribe === 'function') unsubscribe(); } catch (e) { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((l) => {
    const short = normalize(l);
    const final = ALLOWED.includes(short) ? short : 'en';
    setLocaleState(final);
    // Notify global subscribers immediately (guarded)
    try { if (typeof setLocaleGlobal === 'function') setLocaleGlobal(final); } catch (e) { /* ignore */ }
    // persist in background, protected
    (async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        if (AsyncStorage && AsyncStorage.setItem) {
          await AsyncStorage.setItem(STORAGE_KEY, final);
        }
      } catch (e) {
        // ignore errors to avoid crashing the UI
        // console.warn('Failed to persist locale', e);
      }
    })();
  }, []);

  const t = useCallback((key, params) => {
    try {
      const cur = locale || getDeviceLocale();
      let val = safeLookup(cur, key);
      if (val === undefined) {
        val = safeLookup('en', key);
      }
      if (val === undefined) return key;
      if (typeof val !== 'string') return String(val);
      return formatReplace(val, params);
    } catch (e) {
      return key;
    }
  }, [locale]);

  return { t, locale, setLocale };
};

export default useI18n;
