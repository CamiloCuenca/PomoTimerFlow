import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors.json';
import { themeContext } from '../themesContext';


export default function IconButton({ iconName, onPress }) {  // Asegúrate de pasar `onPress` como prop
  
  const { theme } = React.useContext(themeContext);
  
  return (
    <Pressable style={[styles.button, {backgroundColor: theme.primary , color: theme.foreground}]} onPress={onPress}>  {/* Agregar onPress aquí */}
      <Ionicons 
        name={iconName} 
        size={32}
        color={theme.foreground}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    
    padding: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
    
  },
});
