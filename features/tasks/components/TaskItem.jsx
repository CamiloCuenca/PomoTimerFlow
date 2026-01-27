import { View, Text, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Check, Trash2 } from "lucide-react-native";
import { useTheme } from "../../../hooks/useTheme";
import { useLocalization } from '../../../context/LocalizationContext';

export default function TaskItem({ id: _id, title, description, priority, status, pomodoros, icon: _icon, onDelete, onComplete }) {

    const { theme } = useTheme();
    const { t } = useLocalization();

    const statusLabel = status === 'Completed' ? t('task.categories.completed') : status === 'In Progress' ? t('task.categories.in_progress') : status === 'New Task' ? t('task.categories.new') : status;

    return (

        <View style={{ backgroundColor: theme.colors.primary }} className="p-4 rounded-lg m-4">
            <View className="flex flex-row justify-between items-center">
                <Text className="text-white text-lg font-bold">{title}</Text>
                <View className="flex flex-row items-center gap-3">
                    <Pressable onPress={onComplete} className="p-1 rounded-full" style={{ backgroundColor: `${theme.colors.bgMain}22` }}>
                        {Platform.OS === 'web' ? (
                            <Check color={theme.colors.bgMain} size={20} />
                        ) : (
                            <Ionicons name="checkmark" color={theme.colors.bgMain} size={20} />
                        )}
                    </Pressable>
                    <Pressable onPress={onDelete} className="p-1 rounded-full" style={{ backgroundColor: `${theme.colors.bgMain}22` }}>
                        {Platform.OS === 'web' ? (
                            <Trash2 color={theme.colors.bgMain} size={20} />
                        ) : (
                            <Ionicons name="trash-outline" color={theme.colors.bgMain} size={20} />
                        )}
                    </Pressable>
                </View>
            </View>

            <Text className="text-white mt-2">{description}</Text>
                        <View className="mt-3 flex-row gap-3 items-center flex-wrap">
                            <Text
                                style={{ backgroundColor: theme.colors.secondary, alignSelf: 'flex-start' }}
                                className="px-3 py-1 text-white rounded-md text-sm"
                            >
                                {t('task.priority')}: {priority || t('task.priority_medium')}
                            </Text>
                            <Text
                                style={{ backgroundColor: `${status === 'Completed' ? '#22c55e' : theme.colors.bgDarkGreen}` }}
                                className="px-3 py-1 text-white rounded-md text-sm"
                            >
                                {statusLabel}
                            </Text>
                            <Text
                                style={{ backgroundColor: theme.colors.bgDarkGreen }}
                                className="px-3 py-1 text-white rounded-md text-sm"
                            >
                                {t('task.pomodoros')}: {pomodoros ?? 0}
                            </Text>
                        </View>
        </View>

    );
}
