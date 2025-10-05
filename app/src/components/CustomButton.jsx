import { View, Text , Pressable } from "react-native";

export default function CustomButton({title, onPress, style}) {

    if(style === "primary"){
        return (
            <Pressable className=" w-32 bg-primary p-2 rounded-3xl " onPress={onPress}>
            <Text className="text-bgMain font-bold text-lg text-center">{title}</Text>
            </Pressable>    
          );
    }else{
      return (
        <Pressable className=" w-32 bg-secondary p-2 rounded-3xl " onPress={onPress}>
        <Text className="text-white font-bold text-lg text-center">{title}</Text>
        </Pressable>    
      );
    }

}
