import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { themeContext, ThemeProvider } from '../themesContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Screens
import MainTimerScreen from '../screens/MainTimerScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [workTime, setWorkTime] = useState(25 * 60);
  const [restTime, setRestTime] = useState(5 * 60);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <Stack.Screen name="MainTabs">
                {() => <MainTabs workTime={workTime} setWorkTime={setWorkTime} restTime={restTime} setRestTime={setRestTime} />}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function MainTabs({ workTime, setWorkTime, restTime, setRestTime }) {
  const { theme } = React.useContext(themeContext);

  return (
    <Tab.Navigator
      initialRouteName="Timer"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Timer') {
            iconName = focused ? 'hourglass-outline' : 'hourglass';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart-outline' : 'stats-chart';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings-outline' : 'settings';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarActiveBackgroundColor: theme.secondary,
        tabBarInactiveBackgroundColor: theme.tertiary,
        tabBarLabelStyle: { fontSize: 12, fontFamily: 'Georgia' },
        tabBarStyle: { borderColor: theme.primary, position: 'absolute', height: 60 },
        headerStyle: { height: 80, backgroundColor: theme.primary },
      })}
    >
      <Tab.Screen
        name="Settings"
        children={() => <SettingsScreen workTime={workTime} setWorkTime={setWorkTime} restTime={restTime} setRestTime={setRestTime} />}
      />
      <Tab.Screen
        name="Timer"
        children={() => <MainTimerScreen workTime={workTime} setWorkTime={setWorkTime} restTime={restTime} setRestTime={setRestTime} />}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}
