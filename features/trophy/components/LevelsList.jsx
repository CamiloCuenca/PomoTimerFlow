import { View, Text, ScrollView, Platform } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { School, Hourglass, Medal, Star, Flame, CheckCircle } from "lucide-react-native";
import { getAllLevelsStatus } from "../../../utils/levelSystem";

export default function LevelsList({ totalHours }) {
    const { theme } = useTheme();
    const levels = getAllLevelsStatus(totalHours);

    return (
        <View className="px-4 mt-6">
            <Text style={{ color: theme.colors.text }} className="text-lg font-bold mb-4">
                Todos los Niveles
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {levels.map((level, index) => (
                    <View
                        key={level.id}
                        style={{
                            backgroundColor: level.unlocked
                                ? theme.colors.primary
                                : theme.colors.secondary,
                            borderLeftColor: level.color,
                            borderLeftWidth: level.unlocked ? 4 : 2,
                        }}
                        className="mb-3 p-4 rounded-lg flex-row items-center"
                    >
                        {/* Icono del nivel */}
                        <View
                            style={{
                                backgroundColor: level.color,
                                opacity: level.unlocked ? 1 : 0.5,
                            }}
                            className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        >
                            {Platform.OS === "web" ? renderLevelIcon(level.icon, theme) : (
                                <Ionicons
                                    name={level.icon}
                                    size={24}
                                    color={theme.colors.bgMain}
                                />
                            )}
                        </View>

                        {/* Información del nivel */}
                        <View className="flex-1">
                            <View className="flex-row items-center gap-2 mb-1">
                                <Text
                                    style={{
                                        color: theme.colors.text,
                                        opacity: level.unlocked ? 1 : 0.6,
                                    }}
                                    className="text-base font-bold"
                                >
                                    Nivel {level.id}
                                </Text>
                                {level.unlocked && (
                                    Platform.OS === "web" ? (
                                        <CheckCircle size={18} color={level.color} />
                                    ) : (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={18}
                                            color={level.color}
                                        />
                                    )
                                )}
                            </View>

                            <Text
                                style={{
                                    color: theme.colors.text,
                                    opacity: level.unlocked ? 1 : 0.7,
                                }}
                                className="text-sm font-semibold mb-1"
                            >
                                {level.title}
                            </Text>

                            <Text
                                style={{
                                    color: theme.colors.textSecondary,
                                    opacity: level.unlocked ? 1 : 0.6,
                                }}
                                className="text-xs"
                            >
                                {level.description}
                            </Text>

                            <Text
                                style={{
                                    color: level.color,
                                    opacity: level.unlocked ? 1 : 0.7,
                                }}
                                className="text-xs font-semibold mt-2"
                            >
                                {level.minHours}h - {level.maxHours === Infinity ? "∞" : level.maxHours + "h"}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

function renderLevelIcon(icon, theme) {
    switch (icon) {
        case "school":
            return <School size={24} color={theme.colors.bgMain} />;
        case "hourglass":
            return <Hourglass size={24} color={theme.colors.bgMain} />;
        case "medal":
            return <Medal size={24} color={theme.colors.bgMain} />;
        case "star":
            return <Star size={24} color={theme.colors.bgMain} />;
        case "flame":
            return <Flame size={24} color={theme.colors.bgMain} />;
        default:
            return <Star size={24} color={theme.colors.bgMain} />;
    }
}
