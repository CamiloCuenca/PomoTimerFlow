import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors.json';

export default function StatsScreen(){
    return (
        <View style={styles.container}>
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
      backgroundColor: colors.secondary ,
    },
   
});