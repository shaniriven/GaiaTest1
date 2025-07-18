import { ScreenHeaderProps } from "@/types/declarations";
import { Text, View } from "react-native";

const ScreenHeader = ({ text, ...props }: ScreenHeaderProps) => (
  <View className="flex flex-row items-center justify-between">
    <Text className="text-2xl font-JakartaSemiBold">{text}</Text>
  </View>
);

export default ScreenHeader;
