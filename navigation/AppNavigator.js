import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { themeContext, ThemeProvider } from '../themesContext';  // Asegúrate de importar ThemeProvider

// Screens
import MainTimerScreen from '../screens/MainTimerScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [restTime, setRestTime] = useState(5 * 60);

  return (
    <ThemeProvider> {/* Asegúrate de envolver toda la aplicación */}
      <NavigationContainer>
        <AppNavigatorInner
          workTime={workTime}
          setWorkTime={setWorkTime}
          restTime={restTime}
          setRestTime={setRestTime}
        />
      </NavigationContainer>
    </ThemeProvider>
  );
}

function AppNavigatorInner({ workTime, setWorkTime, restTime, setRestTime }) {
  const { theme } = React.useContext(themeContext); // Ahora podemos acceder al tema desde aquí

  return (
    <Tab.Navigator
      initialRouteName="Timer"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name == 'Timer') {
            iconName = focused ? 'hourglass-outline' : 'hourglass';
          } else if (route.name == 'Stats') {
            iconName = focused ? 'stats-chart-outline' : 'stats-chart';
          } else if (route.name == 'Settings') {
            iconName = focused ? 'settings-outline' : 'settings';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarActiveBackgroundColor: theme.secondary,
        tabBarInactiveBackgroundColor: theme.tertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Georgia',
        },
        tabBarStyle: {
          borderColor: theme.primary,
          position: 'absolute',
          height: 60, // Altura del tab bar
        },
        headerStyle: {
          height: 80,
          backgroundColor: theme.primary,
        },
      })}
    >
      <Tab.Screen
        name="Settings"
        children={() => (
          <SettingsScreen
            workTime={workTime}
            setWorkTime={setWorkTime}
            restTime={restTime}
            setRestTime={setRestTime}
          />
        )}
      />
      <Tab.Screen
        name="Timer"
        children={() => (
          <MainTimerScreen
            workTime={workTime}
            setWorkTime={setWorkTime}
            restTime={restTime}
            setRestTime={setRestTime}
          />
        )}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}
