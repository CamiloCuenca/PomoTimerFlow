// Constantes
const WORK_DURATION = 1 * 60;      // 1 minuto para pruebas
const SHORT_BREAK = 5 * 60;        // 5 minutos
const LONG_BREAK = 15 * 60;        // 15 minutos
const WORK_SESSIONS_BEFORE_LONG_BREAK = 4;

// Estado del temporizador
let state = {
  timeLeft: WORK_DURATION,
  isRunning: false,
  timerType: 'work', // 'work' | 'shortBreak' | 'longBreak'
  workSessionsCompleted: 0,
  intervalId: null
};

// Eventos
const eventListeners = {
  complete: []
};

// Funciones del temporizador
function startTimer(callback) {
  // Si ya está corriendo, no hacemos nada
  if (state.isRunning) return;
  
  // Limpiamos cualquier intervalo existente por si acaso
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
  
  state.isRunning = true;
  state.intervalId = setInterval(() => {
    state.timeLeft--;
    
    if (state.timeLeft <= 0) {
      handleTimerComplete();
    }
    
    if (callback) callback(getFormattedTime());
  }, 1000);
}

function pauseTimer() {
  if (!state.isRunning) return;
  
  clearInterval(state.intervalId);
  state.isRunning = false;
}

function resetTimer() {
  clearInterval(state.intervalId);
  state.isRunning = false;
  state.timeLeft = getCurrentTimerDuration();
  state.intervalId = null;
}

function setTimerType(type) {
  state.timerType = type;
  state.timeLeft = getCurrentTimerDuration();
}

function getCurrentTimerDuration() {
  switch (state.timerType) {
    case 'work': return WORK_DURATION;
    case 'shortBreak': return SHORT_BREAK;
    case 'longBreak': return LONG_BREAK;
    default: return WORK_DURATION;
  }
}

function getFormattedTime() {
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Funciones de eventos
function on(event, callback) {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(callback);
  return () => eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
}

function off(event, callback) {
  if (!eventListeners[event]) return;
  eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
}

function emit(event, data) {
  if (!eventListeners[event]) return;
  eventListeners[event].forEach(callback => callback(data));
}

function handleTimerComplete() {
  clearInterval(state.intervalId);
  
  // Emitir evento de finalización antes de cambiar el tipo
  emit('complete', { 
    completedType: state.timerType,
    workSessionsCompleted: state.workSessionsCompleted
  });

  if (state.timerType === 'work') {
    state.workSessionsCompleted++;
    
    if (state.workSessionsCompleted % WORK_SESSIONS_BEFORE_LONG_BREAK === 0) {
      setTimerType('longBreak');
    } else {
      setTimerType('shortBreak');
    }
  } else {
    setTimerType('work');
  }
  
  // Iniciar automáticamente el siguiente temporizador
  startTimer();
}

// Ejecución en segundo plano
import { AppState } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIMER_STATE_KEY = "@PomoTimer_state";

// Guardar el estado actual del temporizador
export const saveTimerState = async () => {
  try {
    await AsyncStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
      ...state,
      intervalId: null, // No guardamos el intervalo
      lastUpdated: Date.now()
    }));
  } catch (e) {
    console.error('Error al guardar el estado del temporizador:', e);
  }
};

// Cargar el estado guardado del temporizador
export const loadTimerState = async () => {
  try {
    const savedState = await AsyncStorage.getItem(TIMER_STATE_KEY);
    if (!savedState) return null;
    
    const parsedState = JSON.parse(savedState);
    if (!parsedState) return null;

    // Restaurar el estado, excepto el intervalo
    const { intervalId, lastUpdated, ...savedStateData } = parsedState;
    
    // Calcular el tiempo transcurrido desde la última actualización
    if (savedStateData.isRunning && lastUpdated) {
      const elapsed = Math.floor((Date.now() - lastUpdated) / 1000);
      savedStateData.timeLeft = Math.max(0, (savedStateData.timeLeft || 0) - elapsed);
      
      // Si el tiempo se agotó, manejamos la finalización
      if (savedStateData.timeLeft <= 0) {
        savedStateData.isRunning = false;
        // No llamamos a handleTimerComplete aquí para evitar bucles
      }
    }
    
    return savedStateData;
  } catch (e) {
    console.error('Error al cargar el estado del temporizador:', e);
    return null;
  }
};

// Limpiar el estado guardado
export const clearTimerState = async () => {
  try {
    await AsyncStorage.removeItem(TIMER_STATE_KEY);
  } catch (e) {
    console.error('Error al limpiar el estado del temporizador:', e);
  }
};

// Inicializar el manejo de AppState
let appStateListener = null;

export const initAppStateListener = () => {
  if (appStateListener) return appStateListener;
  
  appStateListener = AppState.addEventListener('change', async (nextAppState) => {
    if (nextAppState === 'background') {
      // Guardar el estado cuando la app va a segundo plano
      await saveTimerState();
    } else if (nextAppState === 'active') {
      // Restaurar el estado cuando la app vuelve al primer plano
      const savedState = await loadTimerState();
      if (savedState) {
        // Solo actualizamos el estado si el temporizador estaba corriendo
        if (savedState.isRunning) {
          state = { 
            ...state, 
            ...savedState,
            isRunning: false // Lo pausamos temporalmente
          };
          // Iniciamos el temporizador manualmente
          startTimer();
        } else {
          // Si no estaba corriendo, solo actualizamos el estado sin iniciar
          state = { ...state, ...savedState };
        }
      }
    }
  });
  
  return appStateListener;
};

// Exportar solo lo necesario
export default {
  start: startTimer,
  pause: pauseTimer,
  reset: resetTimer,
  setTimerType,
  getCurrentTime: getFormattedTime,
  getState: () => ({ ...state }),
  on,
  off,
  getProgress: () => {
    const totalTime = getCurrentTimerDuration();
    return (totalTime - state.timeLeft) / totalTime;
  }
};