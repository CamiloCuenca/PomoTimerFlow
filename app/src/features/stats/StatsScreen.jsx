import { View, Text , ScrollView } from "react-native";

import LineChart from "./components/lineChart";
export default function StatsScreen() {
  return (
    <ScrollView>
    
    <View className="flex-1 items-left  bg-bgMain">
      <Text className="text-white text-xl font-bold text-left pl-5 pt-5">Sesiones de trabajo</Text>

      <LineChart />

      <Text className="text-white text-xl font-bold text-left pl-5 pt-5">Sesiones de descanso</Text>

      <LineChart />
    </View>
    </ScrollView>
  );
}
