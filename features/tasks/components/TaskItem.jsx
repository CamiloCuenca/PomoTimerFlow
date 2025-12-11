import { View, Text, ScrollView } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

export default function TaskItem({ title, description, priority }) {

    const { theme } = useTheme();
    return (
        <ScrollView style={{ backgroundColor: theme.colors.bgMain }}>

            <View style={{ backgroundColor: theme.colors.primary }} className="p-4 rounded-lg mb-4">
                <Text className="text-white text-lg font-semibold">{title}</Text>
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
        </ScrollView>
    );
}