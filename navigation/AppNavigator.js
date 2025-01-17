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
import SignupScreen from '../screens/SignupScreen';

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
              <>
                <Stack.Screen name="Login">
                  {(props) => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
                </Stack.Screen>
                <Stack.Screen name="Signup">
                  {(props) => <SignupScreen {...props} onSignup={() => setIsAuthenticated(true)} />}
                </Stack.Screen>
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
