import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@PomoTimer_tasks';

// ====================================
// GUARDAR TODAS LAS TAREAS
// ====================================
export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error guardando tareas:', error);
  }
};

// ====================================
// CARGAR TODAS LAS TAREAS AL INICIAR
// ====================================
export const loadTasks = async () => {
  try {
    const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error cargando tareas:', error);
    return [];
  }
};

// ====================================
// AGREGAR UNA NUEVA TAREA
// ====================================
export const addTask = async (task) => {
  try {
    const tasks = await loadTasks();
    tasks.push(task);
    await saveTasks(tasks);
    return tasks;
  } catch (error) {
    console.error('Error agregando tarea:', error);
  }
};

// ====================================
// ELIMINAR UNA TAREA POR ID
// ====================================
export const deleteTask = async (id) => {
  try {
    const tasks = await loadTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    await saveTasks(filteredTasks);
    return filteredTasks;
  } catch (error) {
    console.error('Error eliminando tarea:', error);
  }
};

// ====================================
// ACTUALIZAR UNA TAREA (campos específicos)
// ====================================
export const updateTask = async (id, updates) => {
  try {
    const tasks = await loadTasks();
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    await saveTasks(updatedTasks);
    return updatedTasks;
  } catch (error) {
    console.error('Error actualizando tarea:', error);
  }
};

// ====================================
// MARCAR TAREA COMO COMPLETADA
// ====================================
export const completeTask = async (id) => {
  try {
    const tasks = await loadTasks();
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { ...task, status: 'Completed', completedAt: new Date().toISOString() } 
        : task
    );
    await saveTasks(updatedTasks);
    return updatedTasks;
  } catch (error) {
    console.error('Error completando tarea:', error);
  }
};