import { useFocusEffect } from "expo-router";
import { useCallback , useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ScrollView, Platform } from "react-native";
import LineChartCustom from "./components/lineChart";
import { getCurrentWeekRange } from "../../dateUtils";
import Strak from '../../components/Strak';
import { useTheme } from "../../hooks/useTheme";
import { useLocalization } from '../../context/LocalizationContext';
// NOTE: No importar react-native-google-mobile-ads en el tope (evita crashes en Expo Go). Cargar dinámicamente.


export default function StatsScreen() {
  const [workSessions, setWorkSessions] = useState([]);
  const [breakSessions, setBreakSessions] = useState([]);
  const { theme } = useTheme();
  const { t } = useLocalization();

  // Módulo de ads cargado dinámicamente (null si no está disponible en este entorno)
  const [adsModule, setAdsModule] = useState(null);

  useEffect(() => {
    // No intentar cargar en web
    if (Platform.OS === 'web') return;
    let mounted = true;
    try {
      const mod = require('react-native-google-mobile-ads');
      if (mounted) setAdsModule(mod);
    } catch (e) {
      // Si el módulo nativo no está disponible (p. ej. Expo Go), solo lo ignoramos
      console.warn('react-native-google-mobile-ads no está disponible en este entorno:', e.message || e);
      setAdsModule(null);
    }
    return () => { mounted = false; };
  }, []);

  const loadSessions = async () => {
    try {
      const sessionsData = await AsyncStorage.getItem("sessions");
      if (!sessionsData) return;

      const sessions = JSON.parse(sessionsData);
      const weekDays = getCurrentWeekRange();

      const filterSessionsByType = (type) => {
        return weekDays.map((day) => {
          const daySessions = sessions.filter(
            (s) => s.date === day.date && s.type === type
          );
          return {
            day: day.dayName,
            sessions: daySessions.length,
            date: day.date,
          };
        });
      };

      setWorkSessions(filterSessionsByType("work"));
      setBreakSessions(filterSessionsByType("shortBreak"));
    } catch (e) {
      console.error("Error cargando sesiones:", e);
    }
  };

  
  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

  const workedDays = workSessions.filter((day) => day.sessions > 0).length;

  // Decide si mostramos el banner: módulo disponible y no web
  const canShowAds = !!adsModule && Platform.OS !== 'web' && !!adsModule.BannerAd;
  // Usar TestIds en DEV si el módulo está disponible
  const adUnitId = adsModule ? (__DEV__ ? adsModule.TestIds.BANNER : 'ca-app-pub-6679191668109166/4855665722') : null;

  return (
    <ScrollView style={{ backgroundColor: theme.colors.bgMain }}>
      <View className="p-4">

        <Strak title={t('stats.streak')} days={workedDays} weekSessions={workSessions} />

        {/* Sesiones de trabajo */}
        <View className="mb-6">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold mb-2 ml-3">{t('stats.work_sessions')}</Text>
          <LineChartCustom
            key={JSON.stringify(workSessions)} 
            data={workSessions}
            title={t('stats.work_sessions')}
            color={theme.colors.primary}
          />
        </View>

        {/* Descansos */}
        <View>
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold mb-2 ml-3">{t('stats.break_sessions')}</Text>
          <LineChartCustom
            key={JSON.stringify(breakSessions)} 
            data={breakSessions}
            title={t('stats.break_sessions')}
            color={theme.colors.primary}
          />
        </View>

        {/* Banner Ad - solo si el módulo nativo está disponible */}
        {canShowAds ? (
          <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 32 }}>
            <adsModule.BannerAd
              unitId={adUnitId}
              size={adsModule.BannerAdSize.FULL_BANNER}
              requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
