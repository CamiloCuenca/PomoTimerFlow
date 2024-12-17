import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
        }, tabBarActiveTintColor: '#a500ff', 
           tabBarActiveBackgroundColor: '#1e1e1e',
           tabBarInactiveBackgroundColor: '#333333',
        
        tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Georgia',
          },
          tabBarStyle: { 
            position: 'absolute', 
            height: 60,  // Altura del tab bar
          },
           

      })}
      
      > 

        
        <Tab.Screen name="Settings" component={SettingsScreen}/>
        <Tab.Screen styles name="Timer" component={MainTimerScreen}/>
        <Tab.Screen name="Stats" component={StatsScreen}/>
      </Tab.Navigator>
    </NavigationContainer>

    );
}