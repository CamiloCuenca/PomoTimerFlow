import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity } from 'react-native'; 
import { useTheme } from "../../hooks/useTheme";
import { Play, Pause } from 'lucide-react-native';
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";

export default function Layout() {
  const { theme } = useTheme();
  const { status, isConfigured, handlePlayPause } = useAudioPlayerContext();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: true, 
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.bgMain,
          borderTopWidth: 1,
          borderTopColor: theme.colors.bgDarkGreen,
        },
        headerStyle: {
          backgroundColor: theme.colors.bgMain,
        },
        headerTitleStyle: {
          fontSize: 25,
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.text,
        headerTitleAlign: "center",
     
        headerLeft: () => (
          <Image 
            source={require("../../assets/icon-mini.png")} 
            style={{ 
              width: 40, 
              height: 40, 
              marginLeft: 15,
              borderRadius: 15
            }} 
            resizeMode="contain"
          />
        ),

        headerRight: () => (
          <TouchableOpacity
            onPress={handlePlayPause}
            style={{ backgroundColor: theme.colors.primary, marginRight: 15 }}
            className="w-10 h-10 rounded-full items-center justify-center active:opacity-70"
            disabled={!isConfigured}
          >
            {status.playing ? (
              <Pause size={20} color={theme.colors.bgMain} fill={theme.colors.bgMain} />
            ) : (
              <Play size={20} color={theme.colors.bgMain} fill={theme.colors.bgMain} />
            )}
          </TouchableOpacity>
        )
        
      }}
    >
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
