import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadTasks, saveTasks, addTask as storageAddTask, deleteTask as storageDeleteTask, updateTask as storageUpdateTask, completeTask as storageCompleteTask } from '../utils/taskStorage';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const ACTIVE_KEY = '@PomoTimer_activeTask';

  useEffect(() => {
    const init = async () => {
      const loaded = await loadTasks();
      setTasks(loaded);
      const activeId = await AsyncStorage.getItem(ACTIVE_KEY);
      setActiveTaskId(activeId || null);
      setIsLoading(false);
    };
    init();
  }, []);

  const addTask = async (task) => {
    const updated = await storageAddTask(task);
    setTasks(updated || []);
  };

  const deleteTask = async (id) => {
    const updated = await storageDeleteTask(id);
    setTasks(updated || []);
  };

  const updateTask = async (id, updates) => {
    const updated = await storageUpdateTask(id, updates);
    setTasks(updated || []);
  };

  const completeTask = async (id) => {
    const updated = await storageCompleteTask(id);
    setTasks(updated || []);
  };

  const setActiveTask = async (id) => {
    setActiveTaskId(id);
    if (id) {
      await AsyncStorage.setItem(ACTIVE_KEY, id);
      // Marcar la tarea como "In Progress" si no está completada
      const current = tasks.find(t => t.id === id);
      if (current && current.status !== 'Completed' && current.status !== 'In Progress') {
        const updated = await storageUpdateTask(id, { status: 'In Progress' });
        setTasks(updated || []);
      }
    } else {
      await AsyncStorage.removeItem(ACTIVE_KEY);
    }
  };

  const incrementPomodoros = async (id) => {
    const targetId = `${id}`;
    let nextPomodoros = null;

    setTasks((prev) => {
      const updatedLocal = prev.map((t) => {
        if (t.id === targetId) {
          nextPomodoros = (t.pomodoros || 0) + 1;
          return { ...t, pomodoros: nextPomodoros };
        }
        return t;
      });

      // Persistimos en AsyncStorage
      saveTasks(updatedLocal).catch((err) =>
        console.error('Error guardando pomodoros:', err)
      );
      return updatedLocal;
    });

    // Si encontramos la tarea, sincronizamos también via storageUpdateTask
    if (nextPomodoros !== null) {
      await storageUpdateTask(targetId, { pomodoros: nextPomodoros });
    }
  };

  const value = {
    tasks,
    isLoading,
    activeTaskId,
    addTask,
    deleteTask,
    updateTask,
    completeTask,
    setActiveTask,
    incrementPomodoros,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => useContext(TaskContext);
