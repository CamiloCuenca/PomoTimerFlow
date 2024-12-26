import React, { createContext, useState } from 'react';
import colors from './constants/colors.json';

// Crear el contexto
export const themeContext = createContext(colors.purple); // Valor por defecto del contexto

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  // Usamos un estado para manejar el tema
  const [theme, setTheme] = useState(colors.purple); // Tema inicial

  // Función para cambiar el tema
  const changeTheme = (themeName) => {
    if (colors[themeName]) {
      setTheme(colors[themeName]); // Cambiar al tema seleccionado
    }
  };

  return (
    <themeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </themeContext.Provider>
  );
};
