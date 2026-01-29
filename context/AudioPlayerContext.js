// javascript
          import React, { createContext, useState, useEffect } from 'react';
          import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
          import { useSounds } from '../hooks/useSounds';
          import { sounds } from '../constants/sounds';

          export const AudioPlayerContext = createContext();

          export const AudioPlayerProvider = ({ children }) => {
            const { currentSound } = useSounds();
            const [isConfigured, setIsConfigured] = useState(false);

            // Usar file seguro: currentSound.file o fallback a sounds.ambientMusic.file
            const playerFile = currentSound?.file ?? sounds?.ambientMusic?.file ?? null;

            // Crear el reproductor con la canción actual (o con el fallback)
            const player = useAudioPlayer(playerFile);
            const playerStatus = useAudioPlayerStatus(player);

            useEffect(() => {
              if (!currentSound) {
                console.warn('currentSound es undefined. Usando sounds.ambientMusic como fallback.');
              }
            }, [currentSound]);

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
                try {
                  player.seekTo(0);
                  player.play();
                } catch (e) {
                  console.warn('Error al reiniciar la reproducción:', e);
                }
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