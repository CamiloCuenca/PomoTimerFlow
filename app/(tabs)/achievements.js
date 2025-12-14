import { View, Text } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import TrophyScreen from "../../features/trophy/TrophyScrenn";

export default function Achievements() {
    const { theme } = useTheme();
    return<TrophyScreen />;
}
