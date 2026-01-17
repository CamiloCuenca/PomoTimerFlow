import { useContext } from 'react';
import { AudioPlayerContext } from '../context/AudioPlayerContext';

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext debe usarse dentro de AudioPlayerProvider');
  }
  return context;
};
