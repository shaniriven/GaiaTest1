import { ScreenHeaderProps } from "@/declarations";
import { View, Text } from "react-native";

const ScreenHeader = ({ text, ...props }: ScreenHeaderProps) => (
  <View className="flex flex-row items-center justify-between my-5 px-5">
    <Text className="text-3xl font-JakartaSemiBold">{text}</Text>
  </View>
);

export default ScreenHeader;
