import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from "../../hooks/useTheme";
import { Play, Pause, Settings, ListTodo, Home, BarChart3, Trophy, Info } from 'lucide-react-native';
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
            {Platform.OS === 'web' ? (
              <Info size={28} color={theme.colors.text} />
            ) : (
              <Ionicons
                name="information-circle-outline"
                size={28}
                color={theme.colors.text}
              />
            )}
          </TouchableOpacity>
        ),
        
      }}
    >
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'web'
              ? <Settings color={color} size={size} />
              : <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />

   

       <Tabs.Screen
        name="Task"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
              Platform.OS === 'web'
                ? <ListTodo color={color} size={size} />
                : <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />

         <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'web'
              ? <Home color={color} size={size} />
              : <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'web'
              ? <BarChart3 color={color} size={size} />
              : <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="achievements"
        options={{
          title: "Trophy",
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'web'
              ? <Trophy color={color} size={size} />
              : <Ionicons name="trophy-outline" color={color} size={size} />
          ),
        }}
      />

     
    </Tabs>
  );
}
