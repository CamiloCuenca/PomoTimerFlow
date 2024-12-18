import { Pressable,Text,StyleSheet} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors.json';

export default function IconButton({iconName}){
    return (
        <Pressable style={styles.button}>
            <Ionicons 
                name={iconName} 
                size={32}
                color={colors.secondary}/>
        </Pressable>

    );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor:colors.primary ,
    padding: 10,
    borderRadius: 50,
    color: 'white'
  },
});