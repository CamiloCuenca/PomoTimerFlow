import { View, Text, ScrollView, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { Provider as PaperProvider, FAB, Portal } from "react-native-paper";
import { useTheme } from "../../hooks/useTheme";
import TaskItem from "./components/TaskItem";
import TaskForm from "./components/TaskForm";

export default function TasksScreen() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [formVisible, setFormVisible] = useState(false);

  const categories = ["Todas", "New Task", "In Progress", "Completed"];

  const handleAddTask = () => {
    setFormVisible(true);
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.bgMain }}>
        <ScrollView style={{ backgroundColor: theme.colors.bgMain }}>
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>
          Categorías
        </Text>

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
        <TaskItem
          title="Diseñar interfaz de usuario"
          description="Crear bocetos y prototipos para la nueva aplicación móvil."  
          priority="Alta"
          icon="brush-outline"
          state="In Progress"
        />

    </ScrollView>
        <TaskForm visible={formVisible} onClose={() => setFormVisible(false)} />

        <Portal>
          <FAB
            icon="plus"
            onPress={handleAddTask}
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              backgroundColor: theme.colors.primary,
            }}
            color={theme.colors.bgMain}
          />
        </Portal>
      </View>
    </PaperProvider>
  );
}