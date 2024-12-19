import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import colors from '../constants/colors.json';

//Screens
import MainTimerScreen from '../screens/MainTimerScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator(){
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
        }, tabBarActiveTintColor: colors.primary, 
           tabBarActiveBackgroundColor: colors.secondary,
           tabBarInactiveBackgroundColor: colors.tertiary,
        
        tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Georgia',
          },
          tabBarStyle: { 
            borderColor: colors.primary,
            position: 'absolute', 
            height: 60,  // Altura del tab bar
        
          },
           
          headerStyle:{
            height: 80,
            backgroundColor: colors.primary,
            
          }

      })}
      
      > 

        
        <Tab.Screen name="Settings" component={SettingsScreen}/>
        <Tab.Screen styles name="Timer" component={MainTimerScreen}/>
        <Tab.Screen name="Stats" component={StatsScreen}/>
      </Tab.Navigator>
    </NavigationContainer>

    );
}