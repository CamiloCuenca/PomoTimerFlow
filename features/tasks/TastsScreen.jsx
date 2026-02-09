import { View, Text, ScrollView, FlatList, Pressable, Platform } from "react-native";
import { useState, useRef } from "react";
import { Provider as PaperProvider, FAB, Portal } from "react-native-paper";
import { useTheme } from "../../hooks/useTheme";
import TaskItem from "./components/TaskItem";
import TaskForm from "./components/TaskForm";
import { useTaskContext } from "../../context/TaskContext";
import { useLocalization } from '../../context/LocalizationContext';
// Banner Ad
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

export default function TasksScreen() {
  const { theme } = useTheme();
  const { tasks, addTask, deleteTask, completeTask } = useTaskContext();
  const { t } = useLocalization();
  const [selectedCategory, setSelectedCategory] = useState(t('task.categories.all'));
  const [formVisible, setFormVisible] = useState(false);

  const bannerRef = useRef(null);

  const categories = [t('task.categories.all'), t('task.categories.new'), t('task.categories.in_progress'), t('task.categories.completed')];

  const statusMap = {
    [t('task.categories.new')]: 'New Task',
    [t('task.categories.in_progress')]: 'In Progress',
    [t('task.categories.completed')]: 'Completed'
  };

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

  const filteredTasks = selectedCategory === t('task.categories.all') ? tasks : tasks.filter((tsk) => tsk.status === statusMap[selectedCategory]);

  // Mostrar anuncios solo si no es web y el componente BannerAd está disponible
  const canShowAds = Platform.OS !== 'web' && !!BannerAd;
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6679191668109166/4855665722';

  // (iOS) recargar banner al volver al primer plano para evitar banners vacíos
  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load?.();
    }
  });

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.bgMain }}>
        <ScrollView style={{ backgroundColor: theme.colors.bgMain }}>
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>
          {t('task.title')}
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
        {filteredTasks.map((task) => (
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

        {/* Banner Ad - similar a StatsScreen */}
        {canShowAds ? (
          <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 32 }}>
            <BannerAd
              ref={bannerRef}
              unitId={adUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            />
          </View>
        ) : null}

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