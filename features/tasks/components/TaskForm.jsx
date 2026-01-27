import { View, Text, Modal, Pressable } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { TextInput, Button } from "react-native-paper";
import * as React from "react";
import { useLocalization } from '../../../context/LocalizationContext';

export default function TaskForm({ visible, onClose, onSubmit }) {
    const { theme } = useTheme();
    const { t } = useLocalization();

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [priority, setPriority] = React.useState(t('task.priority_high'));

    const handleClose = () => {
        onClose?.();
    };

    const handleSave = () => {
        if (!title.trim()) return;
        onSubmit?.({ title: title.trim(), description: description.trim(), priority });
        setTitle("");
        setDescription("");
        setPriority(t('task.priority_high'));
        handleClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={handleClose}
        >
            <View
                className="flex-1"
                style={{ backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }}
            >
                <View
                    style={{
                        backgroundColor: theme.colors.bgMain,
                        borderColor: `${theme.colors.primary}33`,
                    }}
                    className="w-11/12 max-w-xl rounded-3xl p-6 border"
                >
                    <Text className="text-xl font-semibold mb-4" style={{ color: theme.colors.text }}>
                        {t('task.new')}
                    </Text>

                                        <View className="gap-4 mb-6 w-full">
                        <TextInput
                            mode="outlined"
                            label={t('task.name')}
                            value={title}
                            onChangeText={setTitle}
                            style={{ backgroundColor: theme.colors.bgMain }}
                            outlineColor={theme.colors.textSecondary}
                            activeOutlineColor={theme.colors.primary}
                            textColor={theme.colors.text}
                            selectionColor={theme.colors.primary}
                            theme={{ colors: { primary: theme.colors.primary, text: theme.colors.text, placeholder: theme.colors.textSecondary } }}
                        />

                        <TextInput
                            mode="outlined"
                            label={t('task.description')}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            style={{ backgroundColor: theme.colors.bgMain }}
                            outlineColor={theme.colors.textSecondary}
                            activeOutlineColor={theme.colors.primary}
                            textColor={theme.colors.text}
                            selectionColor={theme.colors.primary}
                            theme={{ colors: { primary: theme.colors.primary, text: theme.colors.text, placeholder: theme.colors.textSecondary } }}
                        />

                        <View className="gap-2">
                            <Text style={{ color: theme.colors.text, fontWeight: "600" }}>{t('task.priority')}</Text>
                            <View className="flex-row gap-2">
                                {[t('task.priority_high'), t('task.priority_medium'), t('task.priority_low')].map((item) => {
                                    const active = priority === item;
                                    return (
                                        <Pressable
                                            key={item}
                                            onPress={() => setPriority(item)}
                                            style={{
                                                backgroundColor: active ? `${theme.colors.primary}22` : theme.colors.bgDarkGreen,
                                                borderColor: active ? theme.colors.primary : theme.colors.textSecondary,
                                                borderWidth: 1,
                                            }}
                                            className="px-4 py-2 rounded-full"
                                        >
                                            <Text style={{ color: active ? theme.colors.primary : theme.colors.text }}>
                                                {item}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <Button
                            mode="outlined"
                            onPress={handleClose}
                            style={{ flex: 1, borderColor: theme.colors.primary }}
                            textColor={theme.colors.primary}
                        >
                            {t('task.cancel')}
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={{ flex: 1, backgroundColor: theme.colors.primary }}
                            textColor={theme.colors.bgMain}
                        >
                            {t('task.save')}
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}