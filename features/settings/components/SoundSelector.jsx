import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { useSounds } from "../../../hooks/useSounds";
import { Music } from "lucide-react-native";

export default function SoundSelector() {
  const { theme } = useTheme();
  const { currentSound, changeSound, sounds } = useSounds();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="gap-3">
        {Object.entries(sounds).map(([key, sound]) => (
          <TouchableOpacity
            key={key}
            onPress={() => changeSound(key)}
            style={{
              backgroundColor: currentSound.name === sound.name 
                ? theme.colors.primary 
                : theme.colors.bgDarkGreen,
              borderWidth: 2,
              borderColor: currentSound.name === sound.name 
                ? theme.colors.primary 
                : theme.colors.accentGray,
            }}
            className="p-4 rounded-lg flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text style={{ color: theme.colors.text }} className="font-bold text-base">
                {sound.name}
              </Text>
              <Text style={{ color: theme.colors.textSecondary }} className="text-xs mt-1">
                {sound.artist}
              </Text>
            </View>
            
            {currentSound.name === sound.name && (
              <Music size={20} color={theme.colors.bgMain} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
