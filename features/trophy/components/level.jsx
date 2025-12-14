import { View, Text } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";


export default function Level({ Level, title_level, number_of_medals, total_hours, days = 0 }) {
    const { theme } = useTheme();
    return (
        <View style={{ backgroundColor: theme.colors.primary }} className="m-4 p-4 rounded-lg items-center justify-center">

            <View className="mb-4 rounded-full p-5" style={{ backgroundColor: theme.colors.secondary }}>
                <Ionicons name="trophy" color={theme.colors.bgMain} size={60} />
            </View>


            <View className="items-center justify-center">
                <Text style={{ color: theme.colors.text }} className="text-4xl font-bold">
                    Nivel {Level || 1}
                </Text>

                <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                    {title_level || "Default Title"}
                </Text>
            </View>


            <View className=" flex flex-row mt-4 gap-3 w-full">


                <View className="flex flex-col items-center justify-center flex-1">
                    <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
                        {number_of_medals || 0}
                    </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        Medallas
                    </Text>
                </View>

                <View className="flex flex-col items-center justify-center flex-1">
                    <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
                        {total_hours || 0}
                    </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        Total Horas
                    </Text>
                </View>

                <View className="flex flex-col items-center justify-center flex-1">
                     <Text style={{ color: theme.colors.text }} className="font-bold text-3xl">
                    {days}
                </Text>
                    <Text style={{ color: theme.colors.text }} className="text-sm">
                        Dias Racha
                    </Text>
                </View>



            </View>



        </View>
    );
}