import { useFocusEffect } from "expo-router";
import { useCallback , useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ScrollView, Platform } from "react-native";
import LineChartCustom from "./components/lineChart";
import { getCurrentWeekRange } from "../../dateUtils";
import Strak from '../../components/Strak';
import { useTheme } from "../../hooks/useTheme";
import { useLocalization } from '../../context/LocalizationContext';
// NOTE: Se usa la API oficial de la librería para el banner (sigue el ejemplo de la librería)
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

export default function StatsScreen() {
  const [workSessions, setWorkSessions] = useState([]);
  const [breakSessions, setBreakSessions] = useState([]);
  const { theme } = useTheme();
  const { t } = useLocalization();

  const bannerRef = useRef(null);

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

  // Mostrar anuncios solo si no es web y el componente BannerAd está disponible
  const canShowAds = Platform.OS !== 'web' && !!BannerAd;
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6679191668109166/4855665722';

  // (iOS) recargar banner al volver al primer plano para evitar banners vacíos
  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load?.();
    }
  });

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

        {/* Banner Ad - sigue el ejemplo oficial de la librería */}
        {canShowAds ? (
          <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 32 }}>
            <BannerAd
              ref={bannerRef}
              unitId={adUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
