import { View, Text, FlatList, Pressable, ScrollView, Image } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import Level from "./components/level";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, FAB, Portal } from "react-native-paper";
import { medals } from "../../utils/medals";



export default function TrophyScreen() {

    const { theme } = useTheme();
    const [streakDays, setStreakDays] = useState(0);
    const [totalHours, setTotalHours] = useState(0);
    const [medalsCount, setMedalsCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [workSessionsCount, setWorkSessionsCount] = useState(0);
    const [unlockedMedals, setUnlockedMedals] = useState([]);

    const categories = ["Todas", "Obtenidas", "En Progreso"];

    useEffect(() => {
        const loadStats = async () => {
            try {
                const sessions = await AsyncStorage.getItem('sessions');
                const parsedSessions = sessions ? JSON.parse(sessions) : [];

                // Calcular racha (días consecutivos) - CORREGIDO
                let streak = 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalizar a medianoche
                
                let checkDate = new Date(today);

                // Verificar si hay sesión hoy o ayer (la racha puede continuar si trabajaste ayer)
                const todayStr = today.toISOString().split('T')[0];
                const hasToday = parsedSessions.some(s => s.date === todayStr);
                
                if (!hasToday) {
                    // Si no trabajaste hoy, empezar desde ayer
                    checkDate.setDate(checkDate.getDate() - 1);
                }

                // Contar días consecutivos hacia atrás
                while (true) {
                    const dateStr = checkDate.toISOString().split('T')[0];
                    const hasSession = parsedSessions.some(s => s.date === dateStr);
                    
                    if (hasSession) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                // Calcular horas totales (cada sesión de trabajo = ~25 min)
                const workSessions = parsedSessions.filter(s => s.type === 'work').length;
                const hours = Math.round((workSessions * 25) / 60 * 100) / 100;

                setStreakDays(streak);
                setTotalHours(hours);
                setWorkSessionsCount(workSessions);

                // Determinar qué medallas están desbloqueadas
                const unlocked = medals.filter(medal => {
                    if (medal.type === 'sessions') {
                        return workSessions >= medal.requirement;
                    } else if (medal.type === 'streak') {
                        return streak >= medal.requirement;
                    }
                    return false;
                });

                setUnlockedMedals(unlocked.map(m => m.id));
                setMedalsCount(unlocked.length); // ✅ CORREGIDO: Contar medallas desbloqueadas
                
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        };

        loadStats();
    }, []);

    return (
        <PaperProvider>
            <View style={{ flex: 1, backgroundColor: theme.colors.bgMain }}>
                <ScrollView>
                    <Level Level={1} title_level="Aprendiz" number_of_medals={medalsCount} total_hours={totalHours} days={streakDays} />


                    <View className="px-4 mb-4 rounded-full items-center m-4" style={{ backgroundColor: theme.colors.bgDarkGreen, paddingVertical: 10 }}>

                        <FlatList
                            horizontal
                            data={categories}
                            keyExtractor={(item) => item}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 8 }}
                            renderItem={({ item }) => {
                                const isActive = item === selectedCategory;
                                return (
                                    <Pressable
                                        onPress={() => setSelectedCategory(item)}
                                        style={{
                                            backgroundColor: isActive
                                                ? theme.colors.primary
                                                : theme.colors.bgDarkGreen,
                                            borderColor: isActive
                                                ? theme.colors.primary
                                                : theme.colors.textSecondary,
                                            borderWidth: 1,
                                        }}
                                        className="px-4 py-2 rounded-full"
                                    >
                                        <Text
                                            style={{
                                                color: isActive ? theme.colors.bgMain : theme.colors.text,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />
                    </View>


                    <View className="px-4 flex-row flex-wrap justify-center gap-4">
                        {medals
                            .filter((medal) => {
                                const isUnlocked = unlockedMedals.includes(medal.id);
                                if (selectedCategory === "Obtenidas") return isUnlocked;
                                if (selectedCategory === "En Progreso") return !isUnlocked;
                                return true; // "Todas"
                            })
                            .map((medal) => {
                                const isUnlocked = unlockedMedals.includes(medal.id);
                                return (
                                    <View key={medal.id} style={{ width: '28%', alignItems: 'center', marginBottom: 16 }}>
                                        <Image
                                            source={medal.image}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                resizeMode: 'contain',
                                                opacity: isUnlocked ? 1 : 0.3,
                                                tintColor: isUnlocked ? undefined : '#888888'
                                            }}
                                        />
                                        <Text style={{ color: isUnlocked ? theme.colors.text : theme.colors.textSecondary, marginTop: 8, fontSize: 12, fontWeight: '600' }}>
                                            {medal.name}
                                        </Text>
                                        <Text style={{ color: theme.colors.textSecondary, marginTop: 4, fontSize: 10, textAlign: 'center' }}>
                                            {medal.description}
                                        </Text>
                                        {!isUnlocked && (
                                            <Text style={{ color: theme.colors.primary, marginTop: 4, fontSize: 9, textAlign: 'center' }}>
                                                {medal.type === 'sessions' ? `${workSessionsCount}/${medal.requirement}` : `${streakDays}/${medal.requirement}`}
                                            </Text>
                                        )}
                                    </View>
                                );
                            })}
                    </View>
                    





                </ScrollView>
            </View>
        </PaperProvider>
    );
}