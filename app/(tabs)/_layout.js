import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity } from 'react-native'; 
import { useTheme } from "../../hooks/useTheme";
import { Play, Pause } from 'lucide-react-native';
import { useAudioPlayerContext } from "../../hooks/useAudioPlayerContext";
import AnimatedTabBar from "../../components/AnimatedTabBar";

export default function Layout() {
  const { theme } = useTheme();
  const { status, isConfigured, handlePlayPause } = useAudioPlayerContext();
  const router = useRouter();
  
  return (
    
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.bgMain,
        },
        headerTitleStyle: {
          fontSize: 25,
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.text,
        headerTitleAlign: "center",
     
        headerRight: () => (
          <Image 
            source={require("../../assets/icon-mini.png")} 
            style={{ 
              width: 40, 
              height: 40, 
              marginRight: 15,
              borderRadius: 15
            }} 
            resizeMode="contain"
          />
        ),

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push("/info")}
            style={{ marginLeft: 16, padding: 6 }}
            accessibilityLabel="Información de la app"
          >
            <Ionicons
              name="information-circle-outline"
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        ),
        
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
        name="Task"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
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

      <Tabs.Screen
        name="achievements"
        options={{
          title: "Trophy",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" color={color} size={size} />
          ),
        }}
      />

     
    </Tabs>
  );
}
