import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../hooks/useTheme";

export default function TaskItem({ title, description, priority, icon , state }) {

    const { theme } = useTheme();
    return (

        <View style={{ backgroundColor: theme.colors.primary }} className="p-4 rounded-lg m-4">
            <View className="flex flex-row justify-between items-center">
                <Text className="text-white text-lg font-bold">{title}</Text>
                <Ionicons name={icon} color={theme.colors.text} size={24} />
            </View>

            <Text className="text-white mt-2">{description}</Text>
            <View className="mt-2">
                <Text
                    style={{
                        backgroundColor: theme.colors.secondary,
                        alignSelf: 'flex-start'
                    }}
                    className="px-3 py-1 text-white rounded-md text-sm"
                >
                    Prioridad: {priority || "Media"}
                </Text>
            </View>
        </View>

    );
}
