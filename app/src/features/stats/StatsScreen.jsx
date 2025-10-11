import { useFocusEffect } from "expo-router";
import { useCallback , useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ScrollView } from "react-native";
import LineChartCustom from "./components/lineChart";
import { getCurrentWeekRange } from "../../utils/dateUtils";

export default function StatsScreen() {
  const [workSessions, setWorkSessions] = useState([]);
  const [breakSessions, setBreakSessions] = useState([]);

  const loadSessions = async () => {
    try {
      const sessionsData = await AsyncStorage.getItem("sessions");
      if (!sessionsData) return;

      const sessions = JSON.parse(sessionsData);
      const weekDays = getCurrentWeekRange();

      const filterSessionsByType = (type) => {
        return weekDays.map((day) => {
          const daySessions = sessions.filter(
            (s) => s.date === day.date && s.type === type
          );
          return {
            day: day.dayName,
            sessions: daySessions.length,
            date: day.date,
          };
        });
      };

      setWorkSessions(filterSessionsByType("work"));
      setBreakSessions(filterSessionsByType("shortBreak"));
    } catch (e) {
      console.error("Error cargando sesiones:", e);
    }
  };

  // 👇 Recarga la data cada vez que la pantalla se enfoque
  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

  const totalWorkSessions = workSessions.reduce((sum, day) => sum + day.sessions, 0);
  const totalBreakSessions = breakSessions.reduce((sum, day) => sum + day.sessions, 0);

  return (
    <ScrollView className="bg-bgMain">
      <View className="p-4">

        {/* Sesiones de trabajo */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-2 ml-3">Sesiones de trabajo</Text>
          <LineChartCustom
            key={JSON.stringify(workSessions)} 
            data={workSessions}
            title="Sesiones de trabajo"
            color="#4CAF50"
          />
        </View>

        {/* Descansos */}
        <View>
          <Text className="text-white text-xl font-bold mb-2 ml-3">Sesiones de descanso</Text>
          <LineChartCustom
            key={JSON.stringify(breakSessions)} 
            data={breakSessions}
            title="Descansos"
            color="#4CAF50"
          />
        </View>
      </View>
    </ScrollView>
  );
}
