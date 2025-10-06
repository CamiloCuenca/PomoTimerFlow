// Constantes
const WORK_DURATION = 25 * 60;      // 25 minutos
const SHORT_BREAK = 5 * 60;         // 5 minutos
const LONG_BREAK = 15 * 60;         // 15 minutos
const WORK_SESSIONS_BEFORE_LONG_BREAK = 4;

// Estado del temporizador
let state = {
  timeLeft: WORK_DURATION,
  isRunning: false,
  timerType: 'work', // 'work' | 'shortBreak' | 'longBreak'
  workSessionsCompleted: 0,
  intervalId: null
};

// Funciones del temporizador
function startTimer(callback) {
  if (state.isRunning) return;
  
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

function handleTimerComplete() {
  clearInterval(state.intervalId);
  
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

// Exportar solo lo necesario
export default {
  start: startTimer,
  pause: pauseTimer,
  reset: resetTimer,
  setTimerType,
  getCurrentTime: getFormattedTime,
  getState: () => ({ ...state }),
  getProgress: () => {
    const totalTime = getCurrentTimerDuration();
    return (totalTime - state.timeLeft) / totalTime;
  }
};