import { View, Text, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import DurationsButom from "./components/DurationsButom";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-start bg-bgMain">

      <Text className="text-white text-xl font-bold p-4">Duraciones</Text>

      <DurationsButom />

{/* Botones de AsyncStorage
      <Button
        title="Ver AsyncStorage"
        onPress={async () => {
          try {
            const keys = await AsyncStorage.getAllKeys();
            const stores = await AsyncStorage.multiGet(keys);
            console.log('=== AsyncStorage ===');
            stores.forEach(([key, value]) => {
              console.log(`${key}:`, value);
            });
            console.log('===================');
          } catch (e) {
            console.error('Error leyendo AsyncStorage:', e);
          }
        }}
      />

      <Button
        title="Reiniciar toda la semana"
        onPress={async () => {
          try {
            await AsyncStorage.clear();
            console.log('Toda la async storage reiniciada');
          } catch (e) {
            console.error('Error reiniciando toda la async storage:', e);
          }
        }}
      />
 */}


    </View>
  );
}
