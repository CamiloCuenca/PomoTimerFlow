import { LineChart } from "react-native-gifted-charts";
import { View, Text } from "react-native";
import React from 'react';

const LineChartCustom = () => {
  const customDataPoint = () => {
    return (
      <View
        style={{
          width: 16,
          height: 16,
          backgroundColor: 'white',
          borderWidth: 2,
          borderRadius: 8,
          borderColor: 'white',
        }}
      />
    );
  };

  // Datos de ejemplo: sesiones completadas por día de la semana
  const weeklyData = [  // TODO: obtener datos de sesiones (Implementar SQLite para la persistencia de esos datos.)
    { day: 'Lun', sessions: 3 },
    { day: 'Mar', sessions: 5 },
    { day: 'Mié', sessions: 2 },
    { day: 'Jue', sessions: 4 },
    { day: 'Vie', sessions: 6 },
    { day: 'Sáb', sessions: 1 },
    { day: 'Dom', sessions: 0 }
  ];

  // Formatear datos para el gráfico
  const lineData = weeklyData.map((dayData, index) => ({
    value: dayData.sessions,
    label: dayData.day,
    labelTextStyle: { color: 'lightgray', width: 64, textAlign: 'center' },
    customDataPoint: dayData.sessions > 0 ? customDataPoint : undefined,
    hideDataPoint: dayData.sessions === 0
  }));

  // Encontrar el máximo de sesiones para el eje Y
  const maxSessions = Math.max(...weeklyData.map(day => day.sessions), 1);

  return (
    <View style={{ 
      paddingVertical: 20, 
      backgroundColor: '#1f4e33',
      borderRadius: 12,
      margin: 10,
      paddingHorizontal: 5
    }}>
      <Text style={{ 
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 20,
        paddingLeft: 15
      }}>
        Sesiones por Día
      </Text>
      
      <LineChart
        areaChart
        isAnimated
        animationDuration={1000}
        startFillColor="#17CF17"
        startOpacity={0.3}
        endOpacity={0.1}
        initialSpacing={10}
        data={lineData}
        spacing={45}
        thickness={3}
        hideRules={false}
        rulesColor="rgba(255, 255, 255, 0.1)"
        rulesType="dashed"
        yAxisColor="transparent"
        xAxisColor="transparent"
        color="#17CF17"
        curved
        yAxisThickness={0}
        xAxisThickness={0}
        dataPointsHeight={14}
        dataPointsWidth={14}
        dataPointsColor="#17CF17"
        textColor="white"
        maxValue={maxSessions + 1} // Un poco más de espacio en la parte superior
        noOfSections={maxSessions > 0 ? maxSessions : 1}
        yAxisTextStyle={{ color: 'lightgray', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: 'lightgray', fontSize: 12 }}
        showReferenceLine1
        referenceLine1Position={0}
        referenceLine1Config={{
          color: 'rgba(255, 255, 255, 0.3)',
          thickness: 1,
          type: 'dashed',
        }}
      />
    </View>
  );
};

export default LineChartCustom;