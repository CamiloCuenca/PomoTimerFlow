import React from 'react';
import useI18n from '../hooks/useI18n';

// Export a hook named useLocalization to keep existing imports working
export const useLocalization = () => {
  const { t, locale, setLocale } = useI18n();
  return { t, locale, setLocale };
};

// A passthrough provider to avoid breaking app layout where LocalizationProvider is used
export const LocalizationProvider = ({ children }) => {
  // No global provider state - hook uses local state in each component
  return <>{children}</>;
};

export default null;
