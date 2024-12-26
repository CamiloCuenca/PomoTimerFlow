import React,{use, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { themeContext } from '../themesContext';




//Screens
import MainTimerScreen from '../screens/MainTimerScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';


const Tab = createBottomTabNavigator();

export default function AppNavigator(){
  const [workTime, setWorkTime] = useState(25 *60);
  const [restTime, setRestTime] = useState(5 * 60);

  
  const theme = React.useContext(themeContext);
  


    return(
 

     
        <NavigationContainer >
      <Tab.Navigator 
      initialRouteName='Timer' 

  
      
      screenOptions={({ route}) => ({
        tabBarIcon: ({focused,color,size}) =>{
            let iconName;

            if(route.name == 'Timer'){
              iconName =  focused ? "hourglass-outline" : "hourglass" ;
            }
            else if(route.name == 'Stats'){
              iconName = focused ? "stats-chart-outline" : "stats-chart"
            }
            else if(route.name == "Settings"){
              iconName = focused ? "settings-outline" : "settings"
            }


            return <Ionicons name={iconName} size={size} color={color} />;
        }, tabBarActiveTintColor: theme.primary, 
           tabBarActiveBackgroundColor: theme.secondary,
           tabBarInactiveBackgroundColor: theme.tertiary,
        
        tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Georgia',
          },
          tabBarStyle: { 
            borderColor: theme.primary,
            position: 'absolute', 
            height: 60,  // Altura del tab bar
        
          },
           
          headerStyle:{
            height: 80,
            backgroundColor: theme.primary,
            
          }

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
    </NavigationContainer>

    );
}