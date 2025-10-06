import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from 'react-native'; 

export default function Layout() {
  
  return (
    <Tabs
      screenOptions={{
        headerShown: true, 
        tabBarActiveTintColor: "#17CF17",
        tabBarInactiveTintColor: "#ccc",
        tabBarStyle: {
          backgroundColor: "#112111",
          borderTopWidth: 1,
          borderTopColor: "#125612",

        },
        headerStyle: {
          backgroundColor: "#112111",
        },
        headerTitleStyle: {
          fontSize: 25,
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
     
        headerLeft: () => (
          <Image 
            source={require("../../assets/icon-mini.png")} 
            style={{ 
              width: 40, 
              height: 40, 
              marginLeft: 15,
              borderRadius: 15  // Opcional: para hacerlo circular
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
