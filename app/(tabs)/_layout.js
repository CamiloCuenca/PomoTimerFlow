import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from 'react-native'; 
import { useTheme } from "../../hooks/useTheme";

export default function Layout() {
  const { theme } = useTheme();
  
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
