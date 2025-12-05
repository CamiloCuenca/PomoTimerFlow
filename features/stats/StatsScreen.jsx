import { useFocusEffect } from "expo-router";
import { useCallback , useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ScrollView } from "react-native";
import LineChartCustom from "./components/lineChart";
import { getCurrentWeekRange } from "../../dateUtils";
import Strak from '../../components/Strak';
import { useTheme } from "../../hooks/useTheme";


export default function StatsScreen() {
  const [workSessions, setWorkSessions] = useState([]);
  const [breakSessions, setBreakSessions] = useState([]);
    const { theme, changeTheme, themes } = useTheme();

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

  
  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

  const workedDays = workSessions.filter((day) => day.sessions > 0).length;


  return (
    <ScrollView style={{ backgroundColor: theme.colors.bgMain }}>
      <View className="p-4">

        <Strak title="Racha" days={workedDays} weekSessions={workSessions} />

        {/* Sesiones de trabajo */}
        <View className="mb-6">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold mb-2 ml-3">Sesiones de trabajo</Text>
          <LineChartCustom
            key={JSON.stringify(workSessions)} 
            data={workSessions}
            title="Sesiones de trabajo"
            color={theme.colors.primary}
          />
        </View>

        {/* Descansos */}
        <View>
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold mb-2 ml-3">Sesiones de descanso</Text>
          <LineChartCustom
            key={JSON.stringify(breakSessions)} 
            data={breakSessions}
            title="Descansos"
            color={theme.colors.primary}
          />
        </View>
      </View>
    </ScrollView>
  );
}
