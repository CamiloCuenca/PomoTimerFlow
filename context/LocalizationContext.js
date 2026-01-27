import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { setI18nConfig, t as translate } from '../i18n';
import { View, ActivityIndicator, StyleSheet, InteractionManager } from 'react-native';

const STORAGE_KEY = '@PomoTimerFlow:locale';
const ALLOWED_LOCALES = ['en', 'es'];

const LocalizationContext = createContext({
  locale: 'en',
  setLocale: async () => {},
  t: (k) => k,
  isInitializing: true,
});

export const LocalizationProvider = ({ children }) => {
  const [locale, setLocaleState] = useState('en');
  const [isInitializing, setIsInitializing] = useState(true); // solo durante la carga inicial

  // refs para comportamiento estable y evitar reentradas/re-renders innecesarios
  const applyingRef = useRef(false);
  const mountedRef = useRef(true);
  const localeRef = useRef('en');

  const normalizeLocale = (loc) => {
    if (!loc) return 'en';
    return String(loc).split('-')[0].toLowerCase();
  };

  useEffect(() => {
    mountedRef.current = true;
    const init = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && ALLOWED_LOCALES.includes(normalizeLocale(stored))) {
          const short = normalizeLocale(stored);
          setI18nConfig(short);
          localeRef.current = short;
          if (mountedRef.current) setLocaleState(short);
        } else {
          const deviceLocale = Localization.locale || 'en';
          const short = normalizeLocale(deviceLocale);
          const chosen = ALLOWED_LOCALES.includes(short) ? short : 'en';
          setI18nConfig(chosen);
          localeRef.current = chosen;
          if (mountedRef.current) setLocaleState(chosen);
          try {
            await AsyncStorage.setItem(STORAGE_KEY, chosen);
          } catch (e) {
            console.warn('Failed to persist locale', e);
          }
        }
      } catch (e) {
        console.warn('Error loading locale', e);
      } finally {
        if (mountedRef.current) setIsInitializing(false);
      }
    };

    init();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setLocale = useCallback(async (newLocale) => {
    const short = normalizeLocale(newLocale);
    if (!ALLOWED_LOCALES.includes(short)) {
      console.warn(`Locale not allowed: "${newLocale}" - allowed: ${ALLOWED_LOCALES.join(', ')}`);
      return;
    }

    // evitar reentradas
    if (applyingRef.current) {
      console.debug('[Localization] setLocale ignored - already applying', short);
      return;
    }

    // si es el mismo locale, no hacemos nada
    if (short === localeRef.current) {
      console.debug('[Localization] setLocale ignored - same locale', short);
      return;
    }

    applyingRef.current = true;
    console.debug('[Localization] setLocale start', { requested: newLocale, short });

    try {
      // Aplicar el cambio tras las interacciones UI para no interrumpir la navegación
      InteractionManager.runAfterInteractions(() => {
        // small delay to allow native picker/modal to close
        setTimeout(() => {
          try {
            setI18nConfig(short);
            localeRef.current = short;
            if (mountedRef.current) {
              setLocaleState((prev) => (prev === short ? prev : short));
            }
            // Persistimos en background
            AsyncStorage.setItem(STORAGE_KEY, short).catch((e) => console.warn('Failed to persist locale', e));
            console.debug('[Localization] setLocale applied', short);
          } catch (e) {
            console.warn('Error applying locale after interactions', e);
          } finally {
            applyingRef.current = false;
          }
        }, 150);
      });
    } catch (e) {
      console.warn('Error scheduling locale change', e);
      applyingRef.current = false;
    }
  }, []);

  // safe translation wrapper
  const safeT = useCallback((key, params) => {
    try {
      // translate es la función exportada desde i18n.js; puede ser segura pero envolvemos en try/catch
      if (typeof translate === 'function') return translate(key, params);
      return key;
    } catch (err) {
      // No queremos que una traducción rompa la UI
      console.warn('i18n translation error for key', key, err);
      return key;
    }
  }, []);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: safeT,
    isInitializing,
  }), [locale, setLocale, safeT, isInitializing]);

  return (
    <LocalizationContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        {/* Loader solo durante la inicialización; pointerEvents="none" para no bloquear renders */}
        {isInitializing && (
          <View style={styles.overlay} pointerEvents="none">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </View>
    </LocalizationContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
});

export const useLocalization = () => {
  const ctx = useContext(LocalizationContext);
  if (!ctx) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return ctx;
};

export default LocalizationContext;
