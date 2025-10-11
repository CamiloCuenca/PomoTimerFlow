import { LineChart } from "react-native-gifted-charts";
import { View, Text } from "react-native";
import React from "react";

const LineChartCustom = ({ 
  data = [], 
  title = "Sesiones esta semana",
  color = "#17CF17" 
}) => {

  const customDataPoint = () => (
    <View
      style={{
        width: 12,
        height: 12,
        backgroundColor: color,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: "#fff",
      }}
    />
  );

  // 🗓️ Ordenar los días de la semana correctamente
  const dayOrder = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const sortedData = [...data].sort(
    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  );

  // 🧮 Asegurar que haya un punto por cada día (incluso 0)
  const fullWeekData = dayOrder.map(day => {
    const found = sortedData.find(d => d.day === day);
    return found || { day, sessions: 0 };
  });

  // 📊 Adaptar los datos al formato del gráfico
  const lineData = fullWeekData.map((d) => ({
    value: d.sessions,
    label: d.day,
    labelTextStyle: {
      color: "lightgray",
      width: 36,
      textAlign: "center",
    },
    customDataPoint: d.sessions > 0 ? customDataPoint : undefined,
    hideDataPoint: d.sessions === 0,
  }));

  // 🔼 Escala del eje Y redondeada (más estética)
  const maxSessions = Math.max(...fullWeekData.map(d => d.sessions), 1);
  const roundedMax = Math.ceil(maxSessions * 1.2); // agrega un 20% de margen arriba

  // 🎯 Distancia entre puntos ajustada automáticamente
  const spacing = fullWeekData.length <= 4 ? 80 : 50;

  // 🔢 Total de sesiones
  const totalSessions = fullWeekData.reduce((sum, d) => sum + d.sessions, 0);

  return (
    <View
      style={{
        paddingVertical: 16,
        backgroundColor: "#1f4e33",
        borderRadius: 14,
        margin: 10,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-gray-400 text-base pl-2">{title}</Text>
          <Text className="text-white text-3xl font-bold pl-2">
            {totalSessions}
          </Text>
        </View>
        <Text className="text-gray-400 text-base capitalize mb-3">
          {new Date().toLocaleDateString("es-ES", { month: "long" })}
        </Text>
      </View>

      <LineChart
        areaChart
        curved = {false}
        isAnimated
        animationDuration={800}
        data={lineData}
        spacing={spacing}
        thickness={3}
        startFillColor={color}
        endFillColor={color}
        startOpacity={0.25}
        endOpacity={0.05}
        color={color}
        yAxisColor="transparent"
        xAxisColor="rgba(255,255,255,0.1)"
        rulesColor="rgba(255,255,255,0.1)"
        rulesType="dashed"
        yAxisTextStyle={{ color: "lightgray", fontSize: 10 }}
        xAxisLabelTextStyle={{ color: "lightgray", fontSize: 12 }}
        textColor="white"
        dataPointsHeight={10}
        dataPointsWidth={10}
        dataPointsColor={color}
        yAxisThickness={0}
        xAxisThickness={0}
        hideDataPoints={false}
        noOfSections={5}
        maxValue={roundedMax}
        yAxisLabelPrefix=""
        xAxisLabelTexts={dayOrder}
        initialSpacing={25}
      />
    </View>
  );
};

export default LineChartCustom;
