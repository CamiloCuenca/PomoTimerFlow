import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import DurationsButom from "./components/DurationsButom";
import { useLocalization } from '../../context/LocalizationContext';
import { Picker } from '@react-native-picker/picker';
import { useRef } from 'react';

export default function SettingsScreen() {
  const { theme, changeTheme, themes } = useTheme();
  const { t, locale, setLocale } = useLocalization();
  const pendingRef = useRef(null);

  const delayedSetLocale = (value) => {
    // cancelar previo
    if (pendingRef.current) clearTimeout(pendingRef.current);
    // esperar un pequeño delay (dejar cerrar modal del picker en Android/iOS)
    pendingRef.current = setTimeout(() => {
      setLocale(value);
      pendingRef.current = null;
    }, 200);
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.bgMain }} className="flex-1">
      <View className="p-4">
        {/* Sección de Duraciones */}
        <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
          {t('settings.durations')}
        </Text>
        <DurationsButom />

        {/* Sección de Temas */}
        <View className="mt-8 mb-4">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
            {t('settings.theme')}
          </Text>
          <ScrollView 
            style={{ maxHeight: 420 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <View className="gap-3 px-4">
              {Object.entries(themes).map(([key, themeOption]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => changeTheme(key)}
                  style={{
                    backgroundColor: theme.id === key ? theme.colors.primary : theme.colors.bgDarkGreen,
                    borderWidth: 2,
                    borderColor: theme.id === key ? theme.colors.primary : theme.colors.accentGray,
                  }}
                  className="p-4 rounded-lg flex-row items-center justify-between"
                >
                  <Text style={{ color: theme.colors.text }} className="font-bold text-lg">
                    {themeOption.name}
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: themeOption.colors.primary,
                      borderWidth: 2,
                      borderColor: theme.colors.text,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        

        {/* Sección de Idioma */}
        <View className="mt-8 mb-4">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
            {t('settings.language')}
          </Text>
          <View style={{ backgroundColor: theme.colors.bgDarkGreen, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Picker
              selectedValue={locale}
              onValueChange={(value) => delayedSetLocale(value)}
              dropdownIconColor={theme.colors.text}
              style={{ color: theme.colors.text }}
            >
              <Picker.Item label={t('settings.spanish')} value="es" />
              <Picker.Item label={t('settings.english')} value="en" />
            </Picker>
          </View>
        </View>

        {/* Sección de Música

         <View className="mt-8 mb-4">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
            Música Ambiente
          </Text>
          <View className="px-4">
            <Playingsounds />
          </View>
        </View>
         
         */}
        

        {/* Sección de Selección de Canción 
        <View className="mt-8 mb-6">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
            Seleccionar Canción
          </Text>
          <View className="px-4">
            <SoundSelector />
          </View>
        </View>
        */}   
        
        
      </View>
    </ScrollView>
  );
}
