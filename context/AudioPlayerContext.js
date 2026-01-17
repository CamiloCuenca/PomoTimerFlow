import React, { createContext, useState, useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { useSounds } from '../hooks/useSounds';

export const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const { currentSound } = useSounds();
  const [isConfigured, setIsConfigured] = useState(false);

  // Crear el reproductor con la canción actual
  const player = useAudioPlayer(currentSound.file);
  const playerStatus = useAudioPlayerStatus(player);

  // Configurar audio para reproducción en segundo plano
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
        setIsConfigured(true);
      } catch (error) {
        console.error('Error configurando audio:', error);
        setIsConfigured(true);
      }
    };

    configureAudio();
  }, []);

  // Loop automático cuando termina la canción
  useEffect(() => {
    if (playerStatus?.isLoaded && playerStatus?.didJustFinish && player) {
      player.seekTo(0);
      player.play();
    }
  }, [playerStatus?.didJustFinish, player]);

  const handlePlayPause = () => {
    if (!isConfigured || !player) return;

    if (playerStatus?.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleRestart = () => {
    if (!isConfigured || !player) return;
    player.seekTo(0);
    player.play();
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        player,
        status: playerStatus,
        isConfigured,
        handlePlayPause,
        handleRestart,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
