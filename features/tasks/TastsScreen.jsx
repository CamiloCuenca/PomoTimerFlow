import { View, Text, ScrollView, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { Provider as PaperProvider, FAB, Portal } from "react-native-paper";
import { useTheme } from "../../hooks/useTheme";
import TaskItem from "./components/TaskItem";
import TaskForm from "./components/TaskForm";
import { useTaskContext } from "../../context/TaskContext";

export default function TasksScreen() {
  const { theme } = useTheme();
  const { tasks, addTask, deleteTask, completeTask } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [formVisible, setFormVisible] = useState(false);

  const categories = ["Todas", "New Task", "In Progress", "Completed"];

  const handleAddTask = () => {
    setFormVisible(true);
  };

  const handleSubmitTask = (data) => {
    const newTask = {
      id: `${Date.now()}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "New Task",
      createdAt: new Date().toISOString(),
      completedAt: null,
       pomodoros: 0,
    };
    addTask(newTask);
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
        {(
          selectedCategory === "Todas"
            ? tasks
            : tasks.filter((t) => t.status === selectedCategory)
        ).map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            status={task.status}
            pomodoros={task.pomodoros}
            icon={task.status === "Completed" ? "checkmark-circle-outline" : "briefcase-outline"}
            onDelete={() => deleteTask(task.id)}
            onComplete={() => completeTask(task.id)}
          />
        ))}

    </ScrollView>
        <TaskForm visible={formVisible} onClose={() => setFormVisible(false)} onSubmit={handleSubmitTask} />

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