import { View, Text , Pressable } from "react-native";

export default function CustomButton() {
    return (
        <Pressable style={{backgroundColor: "#17CF17", padding: 10, borderRadius: 5}} 
        >
        <Text className="text-white text-lg">Presiona aquí</Text>
        </Pressable>    
      );
}
