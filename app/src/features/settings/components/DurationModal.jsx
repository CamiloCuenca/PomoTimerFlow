import { View, Pressable, Text, Modal } from "react-native";
import { Plus, Minus, Save } from 'lucide-react-native';
import { useState, useEffect } from "react";
import { 
  setWorkDuration, 
  setShortBreak, 
  setLongBreak,
  getWorkDuration,
  getShortBreak,
  getLongBreak
} from "../../../utils/timer";

export default function DurationModal({ 
  visible, 
  onClose, 
  initialMinutes = 25,
  type = 'work' // 'work' | 'shortBreak' | 'longBreak'
}) {
  const [minutes, setMinutes] = useState(initialMinutes);

  // Cargar el valor actual basado en el tipo
  useEffect(() => {
    switch(type) {
      case 'work':
        setMinutes(getWorkDuration());
        break;
      case 'shortBreak':
        setMinutes(getShortBreak());
        break;
      case 'longBreak':
        setMinutes(getLongBreak());
        break;
      default:
        setMinutes(initialMinutes);
    }
  }, [type, initialMinutes]);

  const handleSave = () => {
    switch(type) {
      case 'work':
        setWorkDuration(minutes);
        break;
      case 'shortBreak':
        setShortBreak(minutes);
        break;
      case 'longBreak':
        setLongBreak(minutes);
        break;
    }
    onClose();
  };

  const handleMinus = () => {
    if (minutes > 1) {
      setMinutes(prev => prev - 1);
    }
  };

  const handlePlus = () => {
    setMinutes(prev => prev + 1);
  };

  const getTitle = () => {
    switch(type) {
      case 'work': return 'Duración de trabajo';
      case 'shortBreak': return 'Duración de descanso corto';
      case 'longBreak': return 'Duración de descanso largo';
      default: return 'Editar duración';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="w-11/12 max-w-md rounded-3xl p-8 overflow-hidden bg-white/20 border border-white/30">
          <View className="items-center">
            <Text className="text-white text-xl font-semibold mb-8">
              {getTitle()}
            </Text>

            {/* Contador */}
            <View className="flex-row items-center justify-between w-full mb-10">
              <Pressable
                onPress={handleMinus}
                className="w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center active:bg-gray-200"
              >
                <Minus size={24} color="#4B5563" />
              </Pressable>

              <View className="items-center mx-4">
                <Text className="text-5xl font-bold text-white">
                  {minutes}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">minutos</Text>
              </View>

              <Pressable
                onPress={handlePlus}
                className="w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center active:bg-gray-200"
              >
                <Plus size={24} color="#4B5563" />
              </Pressable>
            </View>

            {/* Botones de acción */}
            <View className="flex-row justify-between w-full gap-4">
              <Pressable
                onPress={onClose}
                className="flex-1 py-4 rounded-xl border border-gray-200 active:bg-secondary"
              >
                <Text className="text-center font-medium text-white">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                className="flex-1 bg-primary py-4 rounded-xl flex-row items-center justify-center space-x-2 active:bg-secondary"
              >
                <Save size={18} color="white" />
                <Text className="text-white font-medium">Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}