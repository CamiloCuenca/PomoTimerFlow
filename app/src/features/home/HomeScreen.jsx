import { View, Text } from "react-native";


import CustomButton from "../../components/CustomButton";

export default function HomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-bgMain">
           
           
            <View className="flex-row gap-10">
                <CustomButton title="Start" onPress={() => {
                    console.log("Start");}} style="primary" />

                <CustomButton title="Reset" onPress={() => {
                    console.log("Reset");}} style="secondary" />
            </View>

           
        </View>
    );
}
