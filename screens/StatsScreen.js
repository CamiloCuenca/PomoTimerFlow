import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { themeContext } from '../themesContext';


export default function StatsScreen(){
  const { theme } = React.useContext(themeContext);

    return (
        <View style={[styles.container , {backgroundColor: theme.secondary}]}>
            <Text>
                Stats
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
   
});