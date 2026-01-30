// Sistema de niveles basado en horas totales completadas
// Cada sesión de trabajo = 25 minutos

export const LEVELS = [
  {
    id: 1,
    title: "Aprendiz del Pomodoro",
    titleKey: 'levels.1.title',
    minHours: 0,
    maxHours: 2,
    icon: "school",
    color: "#3B82F6", // Azul
    description: "¡Tu primer paso en el método Pomodoro!",
    descriptionKey: 'levels.1.description',
  },
  {
    id: 2,
    title: "Aprendiz del Tiempo",
    titleKey: 'levels.2.title',
    minHours: 2,
    maxHours: 5,
    icon: "hourglass",
    color: "#10B981", // Verde
    description: "Empiezas a dominar la gestión del tiempo",
    descriptionKey: 'levels.2.description',
  },
  {
    id: 3,
    title: "Maestro Pomodoro",
    titleKey: 'levels.3.title',
    minHours: 5,
    maxHours: 10,
    icon: "medal",
    color: "#F59E0B", // Naranja
    description: "¡Ya eres un experto en productividad!",
    descriptionKey: 'levels.3.description',
  },
  {
    id: 4,
    title: "Experto del Tiempo",
    titleKey: 'levels.4.title',
    minHours: 10,
    maxHours: 15,
    icon: "star",
    color: "#FFFFFF", // Púrpura
    description: "Tu dedicación es excepcional",
    descriptionKey: 'levels.4.description',
  },
  {
    id: 5,
    title: "Pomodoro Legendario",
    titleKey: 'levels.5.title',
    minHours: 15,
    maxHours: Infinity,
    icon: "flame",
    color: "#EF4444", // Rojo
    description: "¡Eres una leyenda de la productividad!",
    descriptionKey: 'levels.5.description',
  },
];

/**
 * Calcula el nivel actual basado en horas totales
 * @param {number} totalHours - Horas totales completadas
 * @returns {object} Objeto con información del nivel actual
 */
export const getCurrentLevel = (totalHours) => {
  const level = LEVELS.find(
    (l) => totalHours >= l.minHours && totalHours < l.maxHours
  );
  return level || LEVELS[0];
};

/**
 * Calcula el progreso hacia el siguiente nivel
 * @param {number} totalHours - Horas totales completadas
 * @returns {object} Objeto con información del progreso
 */
export const getLevelProgress = (totalHours) => {
  const currentLevelIndex = LEVELS.findIndex(
    (l) => totalHours >= l.minHours && totalHours < l.maxHours
  );
  const currentLevelIdx = currentLevelIndex === -1 ? 0 : currentLevelIndex;

  const currentLevel = LEVELS[currentLevelIdx];
  const nextLevel = LEVELS[currentLevelIdx + 1];

  // Si ya es el nivel máximo
  if (!nextLevel) {
    return {
      current: currentLevel,
      next: null,
      hoursInCurrentLevel: totalHours - currentLevel.minHours,
      hoursNeeded: null,
      progressPercent: 100,
    };
  }

  const hoursInCurrentLevel = totalHours - currentLevel.minHours;
  const hoursNeeded = nextLevel.minHours - currentLevel.minHours;
  const progressPercent = Math.min(
    100,
    Math.round((hoursInCurrentLevel / hoursNeeded) * 100)
  );

  return {
    current: currentLevel,
    next: nextLevel,
    hoursInCurrentLevel,
    hoursNeeded,
    progressPercent,
  };
};

/**
 * Obtiene todos los niveles con su estado de desbloqueo
 * @param {number} totalHours - Horas totales completadas
 * @returns {array} Array de niveles con estado de desbloqueo
 */
export const getAllLevelsStatus = (totalHours) => {
  return LEVELS.map((level) => ({
    ...level,
    unlocked: totalHours >= level.minHours,
  }));
};
