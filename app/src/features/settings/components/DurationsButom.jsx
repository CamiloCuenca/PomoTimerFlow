import { View, Pressable, Text } from "react-native";
import { useState } from "react";
import DurationModal from "./DurationModal";

const DurationsButom = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(null);

  const durations = [
    { id: 1, minutes: 25, label: 'Pomodoro' },
    { id: 2, minutes: 5, label: 'Receso' },
    { id: 3, minutes: 15, label: 'Descanso' },
  ];

  const handlePress = (minutes) => {
    setSelectedMinutes(minutes);
    setModalVisible(true);
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-around p-4 w-full">
        {durations.map((item) => {
          const [number, text] = item.label.split('\n');
          return (
            <Pressable
              key={item.id}
              className="w-28 h-28 rounded-2xl overflow-hidden"
              style={({ pressed }) => [
                { 
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 8,
                }
              ]}
              onPress={() => handlePress(item.minutes)}
            >
              <View className="flex-1 bg-white/20 border border-white/30 rounded-2xl justify-center items-center p-3">
                <Text className="text-white text-3xl font-bold text-center">
                  {item.minutes}
                </Text>
                <Text className="text-white/90 text-sm text-center mt-1 font-medium">
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <DurationModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        minutes={selectedMinutes}
      />
    </View>
  );
};

export default DurationsButom;