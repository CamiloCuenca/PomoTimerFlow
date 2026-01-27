import { View, Pressable, Text, Modal, TextInput } from "react-native";
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
import { useLocalization } from '../../../context/LocalizationContext';

export default function DurationModal({ 
  visible, 
  onClose, 
  initialMinutes = 25,
  type = 'work' // 'work' | 'shortBreak' | 'longBreak'
}) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const { theme } = useTheme();
  const { t } = useLocalization();

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
    const finalMinutes = minutes === '' ? 1 : minutes;
    switch(type) {
      case 'work':
        setWorkDuration(finalMinutes);
        break;
      case 'shortBreak':
        setShortBreak(finalMinutes);
        break;
      case 'longBreak':
        setLongBreak(finalMinutes);
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

  const handleInputChange = (text) => {
    // Solo permitir números
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue >= 1) {
      setMinutes(numValue);
    } else if (text === '') {
      // Permitir campo vacío temporalmente para que el usuario pueda escribir
      setMinutes('');
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'work': return t('durations.duration_work');
      case 'shortBreak': return t('durations.duration_shortBreak');
      case 'longBreak': return t('durations.duration_longBreak');
      default: return t('durations.edit_duration');
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
                <TextInput
                  value={String(minutes)}
                  onChangeText={handleInputChange}
                  keyboardType="number-pad"
                  maxLength={3}
                  style={{ 
                    color: theme.colors.text,
                    fontSize: 48,
                    fontWeight: '700',
                    textAlign: 'center',
                    width: 100,
                  }}
                />
                <Text style={{ color: theme.colors.textSecondary }} className="text-sm mt-1">{t('durations.minutes')}</Text>
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
                <Text style={{ color: theme.colors.text }} className="text-center font-medium">{t('task.cancel')}</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                style={{ backgroundColor: theme.colors.primary }}
                className="flex-1 py-4 rounded-xl flex-row items-center justify-center space-x-2 active:opacity-70"
              >
                <Save size={18} color={theme.colors.bgMain} />
                <Text style={{ color: theme.colors.bgMain }} className="font-medium">{t('task.save')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}