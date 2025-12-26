import { View, Text } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect,useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { getCurrentWeekRange } from "../../../dateUtils";




export default function Level({ Level, title_level, number_of_medals, total_hours, days = 0 }) {
    const { theme } = useTheme();
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



    const workedDays = workSessions.filter((day) => day.sessions > 0).length;


  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

    return (
        <View style={{ backgroundColor: theme.colors.primary }} className="m-4 p-4 rounded-lg items-center justify-center">

            <View className="mb-4 rounded-full p-5" style={{ backgroundColor: theme.colors.secondary }}>
                <Ionicons name="trophy" color={theme.colors.bgMain} size={60} />
            </View>


            <View className="items-center justify-center">
                <Text style={{ color: theme.colors.text }} className="text-4xl font-bold">
                    Nivel {Level || 1}
                </Text>

                <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                    {title_level || "Default Title"}
                </Text>
            </View>


            <View className=" flex flex-row mt-4 gap-3 w-full">


                <View className="flex flex-col items-center justify-center flex-1">
                    <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
                        {number_of_medals || 0}
                    </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        Medallas
                    </Text>
                </View>

                <View className="flex flex-col items-center justify-center flex-1">
                    <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
                        {total_hours || 0}
                    </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        Total Horas
                    </Text>
                </View>

                <View className="flex flex-col items-center justify-center flex-1">
                     <Text style={{ color: theme.colors.text }} className="font-bold text-3xl">
                    {workedDays}
                </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        Dias Racha
                    </Text>
                </View>



            </View>



        </View>
    );
}