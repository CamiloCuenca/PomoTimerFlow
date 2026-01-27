import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { useEffect } from "react";
import { useLocalization } from '../context/LocalizationContext';

const TAB_BAR_HEIGHT = 64;
const INDICATOR_HEIGHT = 64;
const SPRING = {
  damping: 18,
  stiffness: 160,
  mass: 1,
};

export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { t } = useLocalization();

  const tabCount = state.routes.length;
  const tabWidth = width / tabCount;

  const activeIndex = useSharedValue(state.index);

  useEffect(() => {
    activeIndex.value = withSpring(state.index, SPRING);
  }, [state.index]);

  /* =============================
   *  INDICADOR PILL
   * ============================= */
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          activeIndex.value * tabWidth + (tabWidth - tabWidth * 0.8) / 2,
      },
    ],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bgMain,
          paddingBottom: insets.bottom,
          borderTopColor: theme.colors.primary + "22",
          borderTopWidth: 1 ,
        },
      ]}
    >
      {/* INDICADOR */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth * 0.8,
            backgroundColor: theme.colors.primary + "22",
          },
          indicatorStyle,
        ]}
      />

      {/* TABS */}
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const icon = options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused
              ? theme.colors.primary
              : theme.colors.textSecondary,
            size: 28,
          });

          const iconStyle = useAnimatedStyle(() => ({
            transform: [
              {
                translateY: interpolate(
                  activeIndex.value,
                  [index - 1, index, index + 1],
                  [0, -4, 0],
                  Extrapolate.CLAMP
                ),
              },
            ],
          }));

          const labelStyle = useAnimatedStyle(() => ({
            opacity: interpolate(
              activeIndex.value,
              [index - 0.5, index, index + 0.5],
              [0, 1, 0],
              Extrapolate.CLAMP
            ),
          }));

          const rawLabel = options.title ?? route.name;
          const label = typeof rawLabel === 'string' ? t(rawLabel) : rawLabel;

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.tab, { width: tabWidth }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(route.name)}
            >
              <Animated.View style={iconStyle}>
                {icon}
              </Animated.View>

              <Animated.Text
                style={[
                  styles.label,
                  { color: theme.colors.primary },
                  labelStyle,
                ]}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* =============================
 *  STYLES
 * ============================= */
const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  row: {
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    position: "absolute",
    top: 1,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "600",
  },
});
