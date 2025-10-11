export const getCurrentWeekRange = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Domingo) a 6 (Sábado)
    const monday = new Date(now);
    monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Lunes de esta semana
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push({
        date: day.toISOString().split('T')[0],
        dayName: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][day.getDay()],
        dayNum: day.getDate()
      });
    }
    
    return weekDays;
  };