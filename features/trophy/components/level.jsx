import { View, Text, Platform } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { School, Hourglass, Medal, Star, Flame } from "lucide-react-native";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { getCurrentWeekRange } from "../../../dateUtils";
import { getCurrentLevel, getLevelProgress } from "../../../utils/levelSystem";
import { useLocalization } from '../../../context/LocalizationContext';


export default function Level({ number_of_medals, total_hours }) {
    const { theme } = useTheme();
    const [workSessions, setWorkSessions] = useState([]);
    const [levelInfo, setLevelInfo] = useState(null);
    const [levelProgress, setLevelProgress] = useState(null);
    const { t } = useLocalization();

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
        } catch (e) {
            console.error("Error cargando sesiones:", e);
        }
    };

    useEffect(() => {
        // Calcular nivel y progreso cada vez que cambien las horas totales
        if (total_hours !== undefined) {
            const level = getCurrentLevel(total_hours);
            const progress = getLevelProgress(total_hours);
            setLevelInfo(level);
            setLevelProgress(progress);
        }
    }, [total_hours]);

    const workedDays = workSessions.filter((day) => day.sessions > 0).length;


    useFocusEffect(
        useCallback(() => {
            loadSessions();
        }, [])
    );

    if (!levelInfo || !levelProgress) {
        return (
            <View style={{ backgroundColor: theme.colors.primary }} className="m-4 p-4 rounded-lg items-center justify-center">
                <Text style={{ color: theme.colors.text }}>{t('trophy.loading_level')}</Text>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: theme.colors.primary }} className="m-4 p-4 rounded-lg items-center justify-center">
            {/* Icono del nivel */}
            <View className="mb-4 rounded-full p-5" style={{ backgroundColor: levelInfo.color }}>
                {Platform.OS === "web" ? (
                    renderLevelIcon(levelInfo.icon, theme, 60)
                ) : (
                    <Ionicons name={levelInfo.icon} color={theme.colors.bgMain} size={60} />
                )}
            </View>

            {/* Título y descripción del nivel */}
            <View className="items-center justify-center mb-4">
                <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
                    {levelInfo.title}
                </Text>
                <Text style={{ color: theme.colors.textSecondary }} className="text-xs text-center mt-1">
                    {levelInfo.description}
                </Text>
            </View>

            {/* Estadísticas principales */}
            <View className="flex flex-row mt-4 gap-3 w-full">
                <View className="flex flex-col items-center justify-center flex-1">
                    <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
                        {number_of_medals || 0}
                    </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        {t('trophy.medals')}
                    </Text>
                </View>

                <View className="flex flex-col items-center justify-center flex-1">
                    <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
                        {total_hours || 0}h
                    </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        {t('trophy.total_hours')}
                    </Text>
                </View>

                <View className="flex flex-col items-center justify-center flex-1">
                    <Text style={{ color: theme.colors.text }} className="font-bold text-3xl">
                        {workedDays}
                    </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        {t('trophy.streak_days')}
                    </Text>
                </View>
            </View>

            {/* Barra de progreso hacia el siguiente nivel */}
            {levelProgress.next && (
                <View className="w-full mt-6">
                    <View className="flex flex-row justify-between mb-2">
                        <Text style={{ color: theme.colors.textSecondary }} className="text-xs font-semibold">
                            {t('trophy.progress_next')}
                        </Text>
                        <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
                            {levelProgress.hoursInCurrentLevel.toFixed(1)}/{levelProgress.hoursNeeded}h
                        </Text>
                    </View>
                    <View style={{ backgroundColor: theme.colors.secondary }} className="w-full h-3 rounded-full overflow-hidden">
                        <View
                            style={{
                                backgroundColor: levelInfo.color,
                                width: `${levelProgress.progressPercent}%`,
                                height: '100%',
                            }}
                        />
                    </View>
                    <Text style={{ color: theme.colors.textSecondary }} className="text-xs mt-2 text-center">
                        {t('trophy.next_level')}: {levelProgress.next.title}
                    </Text>
                </View>
            )}
        </View>
    );
}

function renderLevelIcon(icon, theme, size = 24) {
    switch (icon) {
        case "school":
            return <School size={size} color={theme.colors.bgMain} />;
        case "hourglass":
            return <Hourglass size={size} color={theme.colors.bgMain} />;
        case "medal":
            return <Medal size={size} color={theme.colors.bgMain} />;
        case "star":
            return <Star size={size} color={theme.colors.bgMain} />;
        case "flame":
            return <Flame size={size} color={theme.colors.bgMain} />;
        default:
            return <Star size={size} color={theme.colors.bgMain} />;
    }
}