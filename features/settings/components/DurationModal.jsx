import { View, Pressable, Text, Modal } from "react-native";
import { Plus, Minus, Save } from 'lucide-react-native';
import { useState, useEffect } from "react";
import { useTheme } from "../../../hooks/useTheme";
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
  const { theme } = useTheme();

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
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      >
        <View
          style={{
            backgroundColor: theme.colors.bgMain,
            borderColor: `${theme.colors.primary}33`,
          }}
          className="w-11/12 max-w-md rounded-3xl p-8 overflow-hidden border"
        >
          <View className="items-center">
            <Text style={{ color: theme.colors.text }} className="text-xl font-semibold mb-8">
              {getTitle()}
            </Text>

            {/* Contador */}
            <View className="flex-row items-center justify-between w-full mb-10">
              <Pressable
                onPress={handleMinus}
                style={{ backgroundColor: theme.colors.primary }}
                className="w-14 h-14 rounded-2xl items-center justify-center active:opacity-70"
              >
                <Minus size={24} color={theme.colors.bgMain} />
              </Pressable>

              <View className="items-center mx-4">
                <Text style={{ color: theme.colors.text }} className="text-5xl font-bold">
                  {minutes}
                </Text>
                <Text style={{ color: theme.colors.textSecondary }} className="text-sm mt-1">minutos</Text>
              </View>

              <Pressable
                onPress={handlePlus}
                style={{ backgroundColor: theme.colors.primary }}
                className="w-14 h-14 rounded-2xl items-center justify-center active:opacity-70"
              >
                <Plus size={24} color={theme.colors.bgMain} />
              </Pressable>
            </View>

            {/* Botones de acción */}
            <View className="flex-row justify-between w-full gap-4">
              <Pressable
                onPress={onClose}
                style={{ borderColor: theme.colors.primary }}
                className="flex-1 py-4 rounded-xl border-2 active:opacity-70"
              >
                <Text style={{ color: theme.colors.text }} className="text-center font-medium">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                style={{ backgroundColor: theme.colors.primary }}
                className="flex-1 py-4 rounded-xl flex-row items-center justify-center space-x-2 active:opacity-70"
              >
                <Save size={18} color={theme.colors.bgMain} />
                <Text style={{ color: theme.colors.bgMain }} className="font-medium">Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}