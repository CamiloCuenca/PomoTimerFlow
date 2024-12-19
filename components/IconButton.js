import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors.json';

export default function IconButton({ iconName, onPress }) {  // Asegúrate de pasar `onPress` como prop
  return (
    <Pressable style={styles.button} onPress={onPress}>  {/* Agregar onPress aquí */}
      <Ionicons 
        name={iconName} 
        size={32}
        color={colors.secondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 50,
    color: 'white',
  },
});
