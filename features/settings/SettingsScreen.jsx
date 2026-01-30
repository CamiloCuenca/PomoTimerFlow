import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import DurationsButom from "./components/DurationsButom";
import { useLocalization } from '../../context/LocalizationContext';

// Importar componentes faltantes
import Playingsounds from '../../components/Playingsounds';
import SoundSelector from './components/SoundSelector';

export default function SettingsScreen() {
  const { theme, changeTheme, themes } = useTheme();
  const { t, locale, setLocale } = useLocalization();

  return (
    <ScrollView style={{ backgroundColor: theme.colors.bgMain }} className="flex-1">
      <View className="p-4">
        {/* Sección de Duraciones */}
        <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
          {t('settings.durations')}
        </Text>
        <DurationsButom />


        {/* Sección de Idioma - UI de cambio eliminada, solo mostrar idioma actual */}
        <View className="mt-8 mb-4">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
            {t('settings.language')}
          </Text>
          <View style={{ backgroundColor: theme.colors.bgDarkGreen, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  try { setLocale('es'); } catch (e) { /* no-op */ }
                }}
                style={{ padding: 8, borderRadius: 8, backgroundColor: locale === 'es' ? theme.colors.primary : theme.colors.bgDarkGreen }}
              >
                <Text style={{ color: locale === 'es' ? theme.colors.bgMain : theme.colors.text }} accessibilityLabel="Español">{'🇪🇸 '}{t('settings.spanish')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  try { setLocale('en'); } catch (e) { /* no-op */ }
                }}
                style={{ padding: 8, borderRadius: 8, backgroundColor: locale === 'en' ? theme.colors.primary : theme.colors.bgDarkGreen }}
              >
                <Text style={{ color: locale === 'en' ? theme.colors.bgMain : theme.colors.text }} accessibilityLabel="English">{'🇺🇸 '}{t('settings.english')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>


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
        




         <View className="mt-8 mb-4">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
            Música Ambiente
          </Text>
          <View className="px-4">
            <Playingsounds />
          </View>
        </View>
         



        <View className="mt-8 mb-6">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold p-4">
            Seleccionar Canción
          </Text>
          <View className="px-4">
            <SoundSelector />
          </View>
        </View>

        
        
      </View>
    </ScrollView>
  );
}
