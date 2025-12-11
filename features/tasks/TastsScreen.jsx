import { View, Text, ScrollView } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export default function TasksScreen() {

    const { theme, changeTheme, themes } = useTheme();

    return (
    <ScrollView style={{ backgroundColor: theme.colors.bgMain }}>

      <View className="p-4">
        <Text className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>
          Mis Tareas
        </Text>
        
      </View>

    </ScrollView>
  );
}