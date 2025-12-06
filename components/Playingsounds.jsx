import { View, TouchableOpacity, Text } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useSounds } from '../hooks/useSounds';
import { useAudioPlayerContext } from '../hooks/useAudioPlayerContext';

export default function Playingsounds() {
  const { currentSound } = useSounds();
  const { status, isConfigured, handlePlayPause, handleRestart } = useAudioPlayerContext();
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.bgDarkGreen }} className="rounded-lg p-4 mb-4">

      <View className="flex-row justify-center gap-4">

        <View className="items-center flex-col">
          <Text style={{ color: theme.colors.text }} className="text-lg font-bold mb-2 text-center">
            {currentSound.name}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-xs text-center mb-4">
            {currentSound.artist}
          </Text>
        </View>

        {/* Botón Play/Pause */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={{ backgroundColor: theme.colors.primary }}
          className="w-16 h-16 rounded-full items-center justify-center active:opacity-70"
          disabled={!isConfigured}
        >
          {status?.playing ? (
            <Pause size={28} color={theme.colors.bgMain} fill={theme.colors.bgMain} />
          ) : (
            <Play size={28} color={theme.colors.bgMain} fill={theme.colors.bgMain} />
          )}
        </TouchableOpacity>

        {/* Botón Reiniciar */}
        <TouchableOpacity
          onPress={handleRestart}
          style={{
            backgroundColor: theme.colors.secondary,
            borderWidth: 2,
            borderColor: theme.colors.primary
          }}
          className="w-16 h-16 rounded-full items-center justify-center active:opacity-70"
          disabled={!isConfigured}
        >
          <RotateCcw size={24} color={theme.colors.text} />
        </TouchableOpacity>

      </View>

      {!isConfigured && (
        <Text style={{ color: theme.colors.textSecondary }} className="text-xs text-center mt-2">
          Configurando audio...
        </Text>
      )}
    </View>
  );
}
