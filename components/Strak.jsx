import { View, Text, Image } from "react-native";

export default function Strak({ title, days = 0, weekSessions = [] }) {
    const dayOrder = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    const normalizedWeek = dayOrder.map((day) => {
        const found = weekSessions.find((item) => item.day === day);
        return { day, sessions: found?.sessions || 0 };
    });

    return (
        <View className="bg-bgDarkGreen rounded-lg mb-5">
            <View className="gap-3 flex-row items-center p-4 rounded-lg ">
                <Text className="text-white font-bold text-2xl">{title}:</Text>
                <Text className="text-white font-bold text-2xl">
                    {days} {days === 1 ? "día" : "días"}
                </Text>
            </View>

            <View className=" p-4 rounded-lg">
                <View className="flex-row justify-between">
                    {normalizedWeek.map(({ day, sessions }) => (
                        <View key={day} className="items-center">
                            {sessions > 0 ? (
                                <Image
                                    source={require("../assets/pomo.png")}
                                    className="w-8 h-8 mb-2"
                                />
                            ) : (
                                <View
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        backgroundColor: "#4B5563",
                                        marginBottom: 8,
                                    }}
                                />
                            )}
                            <Text className="text-white text-xs font-semibold">{day}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
