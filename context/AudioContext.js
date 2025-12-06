import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sounds } from '../constants/sounds';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentSound, setCurrentSound] = useState(sounds.aomoriWings);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar canción guardada de AsyncStorage
  useEffect(() => {
    const loadSoundSetting = async () => {
      try {
        const savedSound = await AsyncStorage.getItem('currentSound');
        if (savedSound) {
          const sound = sounds[savedSound];
          if (sound) {
            setCurrentSound(sound);
          }
        }
      } catch (e) {
        console.error('Error cargando configuración de sonido:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSoundSetting();
  }, []);

  // Cambiar canción y guardarla
  const changeSound = async (soundKey) => {
    try {
      const selectedSound = sounds[soundKey];
      if (selectedSound) {
        setCurrentSound(selectedSound);
        await AsyncStorage.setItem('currentSound', soundKey);
      }
    } catch (e) {
      console.error('Error cambiando canción:', e);
    }
  };

  return (
    <AudioContext.Provider value={{ currentSound, changeSound, isLoading, sounds }}>
      {children}
    </AudioContext.Provider>
  );
};