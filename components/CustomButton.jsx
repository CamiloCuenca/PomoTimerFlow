import { View, Text , Pressable } from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function CustomButton({title, onPress, style}) {
    const { theme } = useTheme();

    if(style === "primary"){
        return (
            <Pressable style={{ backgroundColor: theme.colors.primary }} className="w-32 p-2 rounded-3xl" onPress={onPress}>
            <Text style={{ color: theme.colors.text }} className="font-bold text-lg text-center">{title}</Text>
            </Pressable>    
          );
    }else{
      return (
        <Pressable style={{ backgroundColor: theme.colors.secondary }} className="w-32 p-2 rounded-3xl" onPress={onPress}>
        <Text style={{ color: theme.colors.text }} className="font-bold text-lg text-center">{title}</Text>
        </Pressable>    
      );
    }

}
