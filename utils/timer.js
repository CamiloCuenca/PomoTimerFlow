// Variables editables 
let workDuration = 25;    
let shortBreak = 5;        
let longBreak = 15;       
let workSessionsBeforeLongBreak = 4; 

// Eventos
const eventListeners = {
  complete: [],
  tick: [],
  stateChange: []
};

function getCurrentTimerDuration(timerType) {
  switch (timerType) {
    case 'work': return workDuration * 60;
    case 'shortBreak': return shortBreak * 60;
    case 'longBreak': return longBreak * 60;
    default: return workDuration * 60;
  }
}

// Estado del temporizador
let state = {
  timeLeft: 0, // Will be set by resetTimer()
  isRunning: false,
  timerType: 'work', // 'work' | 'shortBreak' | 'longBreak'
  workSessionsCompleted: 0,
  intervalId: null
};

// Funciones del temporizador
function startTimer(callback) {
  if (state.isRunning) return;
  
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
  
  state.isRunning = true;
  emit('stateChange', { ...state });
  
  // Nota: la programación de la notificación la hace la UI (HomeScreen) para mantener
  // el control (start/pause/reset) en un solo lugar y evitar duplicados.

  state.intervalId = setInterval(() => {
    state.timeLeft--;
    
    // Notificar cada segundo
    if (callback) callback(getFormattedTime());
    emit('tick', { 
      timeLeft: state.timeLeft,
      formattedTime: getFormattedTime(),
      progress: getProgress()
    });
    
    if (state.timeLeft <= 0) {
      handleTimerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  if (!state.isRunning) return;
  
  clearInterval(state.intervalId);
  state.isRunning = false;
  state.intervalId = null;

  // La UI (HomeScreen) es responsable de cancelar la notificación programada si corresponde.

  emit('stateChange', { ...state });
}

function resetTimer() {
  clearInterval(state.intervalId);
  state.timeLeft = getCurrentTimerDuration(state.timerType);
  state.isRunning = false;
  state.intervalId = null;

  // La UI (HomeScreen) cancelará la notificación programada cuando llame a reset.

  emit('stateChange', { ...state });
}

function setTimerType(type) {
  if (!['work', 'shortBreak', 'longBreak'].includes(type)) {
    console.error('Tipo de temporizador no válido:', type);
    return;
  }
  
  state.timerType = type;
  resetTimer();
}

function getFormattedTime() {
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getProgress() {
  const totalTime = getCurrentTimerDuration(state.timerType);
  return 1 - (state.timeLeft / totalTime);
}

// Manejo de eventos
function on(event, callback) {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(callback);
  
  return () => {
    eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
  };
}

function off(event, callback) {
  if (!eventListeners[event]) return;
  eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
}

function emit(event, data) {
  const listeners = eventListeners[event] || [];
  listeners.forEach(callback => callback(data));
}

async function handleTimerComplete() {
  clearInterval(state.intervalId);
  state.intervalId = null;

  // La UI ya debería haber cancelado la notificación pendiente si estaba en foreground.

  emit('complete', {
    completedType: state.timerType,
    workSessionsCompleted: state.workSessionsCompleted
  });

  if (state.timerType === 'work') {
    state.workSessionsCompleted++;
    
    if (state.workSessionsCompleted % workSessionsBeforeLongBreak === 0) {
      setTimerType('longBreak');
    } else {
      setTimerType('shortBreak');
    }
  } else {
    setTimerType('work');
  }
  
  // Empezar automáticamente el siguiente segmento
  startTimer();
}

// Ejecución en segundo plano
import { AppState } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIMER_STATE_KEY = "@PomoTimer_state";

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

export const loadTimerState = async () => {
  try {
    const savedState = await AsyncStorage.getItem(TIMER_STATE_KEY);
    if (!savedState) return null;
    
    const parsedState = JSON.parse(savedState);
    if (!parsedState) return null;

    // Excluir intervalId y scheduledNotificationId (no válidos tras reinicio)
    const { intervalId, lastUpdated, ...savedStateData } = parsedState;

    if (savedStateData.isRunning && lastUpdated) {
      const elapsed = Math.floor((Date.now() - lastUpdated) / 1000);
      savedStateData.timeLeft = Math.max(0, (savedStateData.timeLeft || 0) - elapsed);
      
      if (savedStateData.timeLeft <= 0) {
        savedStateData.isRunning = false;
      }
    }
    
    return savedStateData;
  } catch (e) {
    console.error('Error al cargar el estado del temporizador:', e);
    return null;
  }
};

export const clearTimerState = async () => {
  try {
    await AsyncStorage.removeItem(TIMER_STATE_KEY);
  } catch (e) {
    console.error('Error al limpiar el estado del temporizador:', e);
  }
};

let appStateListener = null;

export const initAppStateListener = () => {
  if (appStateListener) return appStateListener;
  
  appStateListener = AppState.addEventListener('change', async (nextAppState) => {
    if (nextAppState === 'background') {
      await saveTimerState();
    } else if (nextAppState === 'active') {
      const savedState = await loadTimerState();
      if (savedState) {
        if (savedState.isRunning) {
          state = { 
            ...state, 
            ...savedState,
            isRunning: false
          };
          startTimer();
        } else {
          state = { ...state, ...savedState };
          emit('stateChange', { ...state });
        }
      }
    }
  });
  
  return appStateListener;
};

// Getters
export const getWorkDuration = () => workDuration;
export const getShortBreak = () => shortBreak;
export const getLongBreak = () => longBreak;
export const getWorkSessionsBeforeLongBreak = () => workSessionsBeforeLongBreak;

// Setters
export const setWorkDuration = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 1) {
    console.error('Duración de trabajo no válida:', minutes);
    return;
  }
  workDuration = minutes;
  if (state.timerType === 'work') {
    resetTimer();
  }
}

export const setShortBreak = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 1) {
    console.error('Duración de descanso corto no válida:', minutes);
    return;
  }
  shortBreak = minutes;
  if (state.timerType === 'shortBreak') {
    resetTimer();
  }
}

export const setLongBreak = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 1) {
    console.error('Duración de descanso largo no válida:', minutes);
    return;
  }
  longBreak = minutes;
  if (state.timerType === 'longBreak') {
    resetTimer();
  }
}

export const setWorkSessionsBeforeLongBreak = (sessions) => {
  if (typeof sessions !== 'number' || sessions < 1) {
    console.error('Número de sesiones no válido:', sessions);
    return;
  }
  workSessionsBeforeLongBreak = sessions;
}

// Inicializar el temporizador
resetTimer();

// Exportar la API pública
export default {
  start: startTimer,
  pause: pauseTimer,
  reset: resetTimer,
  setTimerType,
  getCurrentTime: getFormattedTime,
  getState: () => ({ ...state }),
  getProgress,
  on,
  off
};