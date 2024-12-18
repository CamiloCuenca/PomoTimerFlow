import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors.json';


export default function SettingsScreen(){
    return (
        <View style={styles.container}>
            <Text>
                Settings
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.secondary ,
    },
   
});