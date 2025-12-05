import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../constants/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.green);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tema guardado de AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          const themeKey = Object.keys(themes).find(
            key => themes[key].id === savedTheme
          );
          if (themeKey) {
            setTheme(themes[themeKey]);
          }
        }
      } catch (e) {
        console.error('Error cargando tema:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Cambiar tema y guardarlo
  const changeTheme = async (themeKey) => {
    try {
      const selectedTheme = themes[themeKey];
      if (selectedTheme) {
        setTheme(selectedTheme);
        await AsyncStorage.setItem('appTheme', selectedTheme.id);
      }
    } catch (e) {
      console.error('Error guardando tema:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, isLoading, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
